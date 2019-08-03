'use strict'

const crypto = require('crypto')
const moment = require('moment')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('mrclgst10@gmail.com', 'Marcelo Augusto')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'O e-mail não foi encontrado. Verifique se você o digitou corretamente.' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'O token de recuperação está expirado.' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Não foi possível resetar a sua senha. Tente mais tarde.' } })
    }
  }
}

module.exports = ForgotPasswordController
