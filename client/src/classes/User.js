import Person from './Person'

class User {
  constructor (data) {
    this.Build(data)
  }
  Build (data) {
    this.logged = false
    this.nick = ''
    this.profile = 0
    this.owner = new Person(data ? data.person || {} : {})
  }
}
export default User
