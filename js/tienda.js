class Tienda{
    constructor(id, title, images, description, price){
        this.id = id,
        this.title = title,
        this.images = images,
        this.description = description,
        this.price = price        
    }   
}
let tienda = []
const ver_tienda = async() =>{
    const response = await fetch("https://api.escuelajs.co/api/v1/products")
    const data = await response.json()    
    for (let items of data){        
        let nuevo_item = new Tienda(items.id, items.title, items.images, items.description, items.price)
        tienda.push(nuevo_item) 
    }   
    localStorage.setItem("nuevo_item", JSON.stringify(tienda))    
}

ver_tienda()
let carrito_compra = JSON.parse(localStorage.getItem("carrito")) || [] //OPERADOR OR

//STORAGE TIENDA CON OPERADOR TERNARIO
localStorage.getItem("tienda") ? tienda = JSON.parse(localStorage.getItem("tienda")) :  
localStorage.setItem("tienda", JSON.stringify(tienda))

//VARIABLES
let btn_carrito = document.getElementById("boton_carrito")//BOTON DEL CARRITO

let modalBody = document.getElementById("modal-body")// MODAL DE LA CARD

let finalizar_compra = document.getElementById("btn_compra")//BOTON PARA FINALIZAR LA COMPRA DEL CARRITO

let total_compra = document.getElementById("total") //PARA EL PRECIO TOTAL

let productos_destacados = document.getElementById("productos_destacados") // DIV DONDE SE VA A CARGAR EL CATALOGO

let div_categorias = document.getElementById("div_categorias")// DIV DONDE VAN LAS CATEGORIAS

let btn_ocultar_destacados = document.getElementById("ocultar_catalogo")//BOTON PARA OCULTAR CATALOGO

let btn_mostrar_catalogo = document.getElementById("ver_catalogo")//BOTON PARA MOSTRAR CATALOGO

let btn_vaciar = document.getElementById("btn_vaciar") // BOTON PARA VACIAR EL CARRITO

let buscar = document.getElementById("inputBuscar") // INPUT DE BUSCAR

let btnBuscar = document.getElementById("btnBuscar") // BOTON BUSQUEDA



//FUNCION PARA VER LOS PRODUCTOS
function ver_productos (array){
    div_categorias.innerHTML = ""
    array.forEach(producto => { 
        const {id, title, description, price, images} = producto //DESESTRUCTURACION
        let nuevoProducto = document.createElement("div")
        nuevoProducto.innerHTML =   
                            `<div id="${id}" class="card text-bg-dark" style="width: 20rem;">
                                <img class="card-img-top imgTienda" style="height: 16rem;" src="${images}" alt="${title}">
                                <div class="card-body text-center">
                                    <h4 class="card-title">${title}</h4>
                                    <p><strong>Descripcion</strong>: ${description}</p>
                                    <p class="">Precio: u$d ${price}</p>
                                    <p class="">ID: ${id}</p>
                                    <button id=btnCompra${id} class="btn btn-warning btnComprar">Agregar al carrito</button>
                                </div>
                            </div>`
        div_categorias.append(nuevoProducto)

        //BOTON PARA AGREGAR EL PRODUCTO AL CARRITO
        let btnCompra = document.getElementById(`btnCompra${id}`)
        btnCompra.addEventListener("click", ()=>{
        funcion_carrito(producto, "nuevo")          
           
        })
    })
}

//--------------- OCULTAR CATALOGO
function funcion_esconder_destacados(){
    div_categorias.innerHTML = ""
  }
  
  //--------------- AGREGAR AL CARRITO
  function funcion_carrito(items){
    let agregados = carrito_compra.find((e)=> (e.id == items.id))    
    if(agregados == undefined){        
      carrito_compra = [...carrito_compra,items] // SPREAD
      localStorage.setItem("carrito", JSON.stringify(carrito_compra))    
       
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
        icon: 'success',
        title: 'Producto agregado al carrito'
        })
  
    }else{  
      
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
            icon: 'error',
            title: `${items.title} ya se encuentra en el carrito`
            })
    }
    
  }
  
  //--------------- CARGAR EL CARRITO
  function funcion_carga_carrito(array){
      
    modalBody.innerHTML = ""
    
    array.forEach((producto_carrito)=>{
       
        modalBody.innerHTML += `<div class="card border-primary mb-3 cardCarrito" id ="producto_carrito${producto_carrito.id}" style="max-width: 600px;">
                                <div class=d-flex>
                                    <img class="card-img-top" src="${producto_carrito.images}" alt="${producto_carrito.title}">
                                
                                    <div class="card-body ms-3">
                                        <h4 class="card-title">${producto_carrito.title}</h4>                                         
                                        <p class="card-text">u$$D ${producto_carrito.price}</p> 
                                        <button class= "btn btn-danger" id="btn_eliminar${producto_carrito.id}"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>    
                            </div>`  
  })
  array.forEach((producto_carrito, index)=>{
    document.getElementById(`btn_eliminar${producto_carrito.id}`).addEventListener("click",()=>{
      Toastify({
        style: {
            background: "green",
            color:"white"
          },
        text: `${producto_carrito.title} ha sido eliminado`,
        offset: {
          x: 50, 
          y: 10 
        },
      }).showToast();           
              
        array.splice(index, 1)              
        localStorage.setItem("carrito", JSON.stringify(array))      
        let producto_removido = document.getElementById(`producto_carrito${producto_carrito.id}`)      
        producto_removido.remove()      
        funcion_contador(array)
        
  
    })
    
  })       
  funcion_contador(array)    
  }
  //--------------- COMPRA TOTAL
  function funcion_contador(array){
    let contador= 0
    
    contador = array.reduce((contador, producto_carrito)=>{
        return contador + producto_carrito.price
    },0)
    
    contador == 0 ? total_compra.innerHTML = `
    <iframe id="gif_carrito" src="https://media.tenor.com/8BeuRyZSb90AAAAj/shopping-cart-shopping.gif" width="480" height="292" frameBorder="0" class="giphy-embed"></iframe>
    <p id="carrito_p">No hay productos en el carrito</p>` : total_compra.innerHTML = `<p id="carrito_p">Hasta el momento. el total de su compra es: $${contador}</p>
    `
  }
  
  //--------------- FINALIZAR COMPRA
  function funcion_finalizar_compra(){
    //PReguntar si ta seguro
    Swal.fire({
        title: 'Desea finalizar su compra?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result)=>{
        if(result.isConfirmed){
            localStorage.clear()
            Swal.fire({
            title: 'Su compra se ha realizado con exito',
            icon: 'success',
            confirmButtonColor: 'green',
            text: `Muchas gracias, los productos han sido adquiridos `,
            })
            carrito_compra =[]
            funcion_carga_carrito(carrito_compra).remove()
            localStorage.removeItem("carrito")
            
        }else{          
            Swal.fire({
                title: 'No se ha realizado su compra',
                icon: 'info',
                text: `Los productos siguen en el carrito`,
                confirmButtonColor: 'green',
                timer:3500
            })
        }
    })
  }
  
  function vaciarCarrito(){
    Swal.fire({
      title: 'Desea vaciar el carrito?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
  }).then((result)=>{
      if(result.isConfirmed){
          localStorage.clear()
          Swal.fire({
          title: 'Su carrito ahora se encuentra vacio',
          icon: 'success',
          confirmButtonColor: 'green',
          text: `Se han eliminado todos los productos `,
          })
          carrito_compra =[]
          funcion_carga_carrito(carrito_compra).remove()
          localStorage.removeItem("carrito")
          
      }else{          
          Swal.fire({
              title: 'No se ha realizado la accion',
              icon: 'info',
              text: `Los productos siguen en el carrito`,
              confirmButtonColor: 'green',
              timer:3500
          })
      }
  })
  }
  function ocultar_categorias(){
    div_categorias.innerHTML = ""
   }
  
  //FUNCION PARA BUSQUEDA DE PRODUCTOS
let mi_busqueda = document.getElementById("busqueda")
function buscar_productos (){
        let buscarProducto = document.getElementById("inputBuscar")
        let busqueda = tienda.filter((producto)=> producto.title.toLowerCase().includes(buscarProducto.value.toLowerCase()))
        if(busqueda.length == 0){
            Swal.fire({
                icon: 'erro',
                title: 'El producto no se encuentra en la tienda, vuelva a intentar',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
            })

            ver_productos(tienda)
        }else{
            for(let productosEncotrados of busqueda){
                mi_busqueda.innerHTML = ""
                ver_productos(busqueda)
            }
        }
    }    
   
    btnBuscar.addEventListener("click", ()=>{
        buscar_productos(tienda)
    })
    buscar.addEventListener("keyup", buscar_productos)
ver_productos(tienda)
  
  //BOTONES Y EVENT LISTENERS
  //-------------- BOTON PARA MOSTRAR CATEGORIAS
  btn_mostrar_catalogo.addEventListener("click", ()=>{   
        ver_productos(tienda)
       
    })
    
  
  
  //--------------- BOTON FINALIZAR COMPRA
  finalizar_compra.addEventListener("click", ()=>{funcion_finalizar_compra()})
  
  
  
  //--------------- BOTON CARRITO
  btn_carrito.addEventListener("click", ()=>{
      funcion_carga_carrito(carrito_compra)
  })
  
  //-------------- BOTON PARA VACIAR EL CARRITO
  btn_vaciar.addEventListener("click", () =>{
    vaciarCarrito()       
       
  })
  //--------------- BOTON OCULTAR CATEGORIAS
btn_ocultar_destacados.onclick = ocultar_categorias
