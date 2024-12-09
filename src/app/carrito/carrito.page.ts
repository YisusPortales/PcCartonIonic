import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage{
  carrito: any[] = [];

  constructor(private alertController: AlertController, private navCtrl: NavController) { }

  ionViewWillEnter() {
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  aumentarCantidad(indice: number) {
    this.carrito[indice].cantidad++;
    this.actualizarLocalStorage();
  }

  disminuirCantidad(indice: number) {
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.eliminarProducto(indice);
    }
    this.actualizarLocalStorage();
  }

  eliminarProducto(indice: number) {
    this.carrito.splice(indice, 1);
    this.actualizarLocalStorage();
  }

  obtenerPrecioTotal() {
    return this.carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
  }

  async realizarCompra() {
    const alerta = await this.alertController.create({
      header: 'Confirmación',
      message: `El total de su compra es de $${this.obtenerPrecioTotal()}. ¿Desea continuar?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.vaciarCarrito();
            this.navCtrl.navigateRoot('/pagina-inicio');
            console.log('Compra realizada con éxito.');
          },
        },
      ],
    });

    await alerta.present();
  }

  vaciarCarrito() {
    this.carrito = [];
    this.actualizarLocalStorage();
  }

  actualizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
