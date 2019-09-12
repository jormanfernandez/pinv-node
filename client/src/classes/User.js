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
    this.access = Object.assign([
      {
        url: '/person/create',
        name: 'Ingresar Persona'
      },
      {
        url: '/person/modify',
        name: 'Ver y Modificar Persona'
      },
      {
        url: '/user/create',
        name: 'Crear usuario'
      },
      {
        url: '/user/modify',
        name: 'Ver y Modificar usuario'
      },
      {
        url: '/category',
        name: 'Categorias'
      },
      {
        url: '/article/add',
        name: 'Agregar Articulo al inventario'
      },
      {
        url: '/article/modify',
        name: 'Ver y Modificar Articulos'
      },
      {
        url: '/article/assign',
        name: 'Asignar articulos'
      },
      {
        url: '/report',
        name: 'Reportes'
      }], data.access)
  }
}
export default User
