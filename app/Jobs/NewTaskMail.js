'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  // Defines how many jobs will be processed simultaneously
  static get concurrency () {
    return 1
  }

  // Define unique key to identify each job in application
  static get key () {
    return 'NewTaskMail-job'
  }

  // Logic to send emails
  async handle ({ email, username, title, file }) {
    console.log(`Job: ${NewTaskMail.key}`)

    await Mail.send(
      ['emails.new_task'],
      { username, title, hasAttachment: !!file },
      message => {
        message
          .to(email)
          .from('mrclgst10@gmail.com', 'Marcelo | Rocketseat')
          .subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
