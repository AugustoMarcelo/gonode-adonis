'use strict'

const Model = use('Model')

class Project extends Model {
  /**
   * Relationship: a Project belong to a User
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * Relationship: a Project has many Tasks
   */
  tasks () {
    return this.hasMany('App/Models/Task')
  }
}

module.exports = Project
