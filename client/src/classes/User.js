class User {
  constructor (data) {
    this.logged = false

    if (!data) {
      return
    }

    this.Build(data)
  }
  Build (data) {
    console.log(data)
    this.logged = data.logged
    this.nick = data.nick
    this.access = Object.assign([], data.access)
    this.id = data._id
  }
}
export default User
