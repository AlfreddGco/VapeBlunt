import React from 'react';
//libraries
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
//Screens
import Inicio from './Inicio';
import Tienda from './Tienda';
import Producto from './Producto';
import Categorias from './Categorias';
import Carrito from './Carrito';
import Checkout from './Checkout';
import Blog from './Blog';
import DisplayProducts from './DisplayProducts';

const StackInicio = createStackNavigator()
const StackTienda = createStackNavigator()
const StackCarrito = createStackNavigator()
const StackBlog = createStackNavigator()

function InicioStack({ navigation }) {
  return (
    <StackInicio.Navigator initialRouteName="Inicio" headerMode="none" >
      <StackInicio.Screen name="Inicio" component={Inicio}/>
      <StackTienda.Screen name="Producto" component={Producto}/>
    </StackInicio.Navigator>
  )
}

function TiendaStack() {
  return (
    <StackTienda.Navigator initialRouteName="Tienda" headerMode="none" >
      <StackTienda.Screen name="Tienda" component={Tienda}/>
      <StackTienda.Screen name="Categorias" component={Categorias}/>
      <StackTienda.Screen name="Producto" component={Producto}/>
      <StackTienda.Screen name="Display Products" component={DisplayProducts}/>
    </StackTienda.Navigator>
  )
}

function CarritoStack() {
  return (
    <StackCarrito.Navigator initialRouteName="Carrito" headerMode="none">
      <StackCarrito.Screen name="Carrito" component={Carrito}  />
      <StackCarrito.Screen name="Checkout" component={Checkout}  />
    </StackCarrito.Navigator>
  )
}

function BlogStack() {
  return (
    <StackBlog.Navigator initialRouteName="Blog" headerMode="none">
      <StackBlog.Screen name="Blog" component={Blog} options={{ title: 'Blogs' }} />
    </StackBlog.Navigator>
  )
}

export {
  InicioStack,
  TiendaStack,
  CarritoStack,
  BlogStack,
}