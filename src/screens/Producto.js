import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

import InfoTab from './InfoTab'
import { 
  SafeAreaView,
  Header,
  DynamicImage,
} from '../components';

import { colors } from '../assets';

import { connect } from 'react-redux';
import { productInfo } from '../shopify/products';

const winWidth = Math.round(Dimensions.get('window').width)

function MiniTab({text, active, onPress}){
  if(active){
    return(
      <TouchableOpacity onPress={() => onPress()} style={{flex: 1, backgroundColor: colors.black,
        height: 40, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.lightgreen}}>
        <Text style={{textAlign: 'center',color: colors.lightgreen}}>{text}</Text>
      </TouchableOpacity>
    )
  }else{
    return(
      <TouchableOpacity onPress={() => onPress()} style={{flex: 1, backgroundColor: colors.black, height: 40, justifyContent: 'center'}}>
        <Text style={{textAlign: 'center',color: colors.white}}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

class Producto extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedImageIndex: 0,
      images: [require('../assets/images/davinci-black.png'), require('../assets/images/davinci-blue.png')],
      tab: 'Info',
      rating: 4,
      product: {},
      variantIndex: 0,
      images: [],
    }
    this.renderImageIndicator = this.renderImageIndicator.bind(this)
    this.selectVariant = this.selectVariant.bind(this)
  }

  componentDidMount(){
    const {handle} = this.props.route.params
    productInfo(handle).then((data)=> {
      images = this.prepareImages(data)
      this.setState({product: data, selectedVariant: data.variants[0].title, images: images})
    })
    this.props.navigation.setOptions({
      headerShown: false,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: 'black',
    })
  }

  prepareImages = (product) => {
    images = product.images
    if(product.variants.length > 1){
      product.variants.forEach(variant => {
        if(images.indexOf(variant.image) === -1){
          images.push(variant.image)
        }
      })
    }
    return images
  }

  setSelectedImageIndex = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const selectedImageIndex = Math.round(contentOffset.x / winWidth)
    this.setState({ selectedImageIndex })
  }

  selectVariant = (variantTitle) => {
    //change image
    let {product, selectedImageIndex, images} = this.state
    let index = selectedImageIndex
    let imageURL = ""
    //get image of variant
    product.variants.forEach((variant) => {
      if(variant.title === variantTitle){
        imageURL = variant.image
      }
    })
    if(imageURL){//get index of image
      images.forEach((image, i) => {
        if(image === imageURL){
          index = i
        }
      })
    }
    //set scrollview index
    this.refs.imagesSV.scrollTo({x: winWidth*index});
    
    found = false
    i = 0
    while(!found && i < product.variants.length){
      if(product.variants[i].title === variantTitle){
        found = true
      }
      i++
    }
    if(found){
      this.setState({variantIndex: (i-1)})
    }
  }

  renderImageIndicator = (i) => {
    let color = (i === this.state.selectedImageIndex) ? colors.black : colors.grey
    return <Text key={i} style={{textAlign: 'center', fontSize: 40, color: color}}>{`\u2022`}</Text>
  }
  
  render(){
    const { navigation } = this.props
    const {
      product,
      tab,
      selectedImageIndex,
      images,
    } = this.state

    return(
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <Header color={colors.white} onPress={navigation.pop} arrow />
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={this.setSelectedImageIndex}
        ref={"imagesSV"}>
          {images.map((image, i) => (
            <DynamicImage 
            key={i}
            backgroundColor={colors.white}
            containerWidth={winWidth}
            width={winWidth/3}
            source={{uri: image}} />
          ))}
        </ScrollView>
        <View style={styles.indicators}>
          {images.map((_, i) => (
            <Text key={i}
              style={{
                textAlign: 'center',
                fontSize: 40,
                color: i == selectedImageIndex ? colors.black : colors.grey,
                marginBottom: 10,
                height: 40,
              }}
            >
              {`\u2022`}
            </Text>
          ))}
        </View>
        <View style={{flexDirection: 'row'}}>
          <MiniTab text="INFORMACIÓN" onPress={() => this.setState({tab: 'Info'})} active={tab === 'Info'}/>
        </View>
        <ScrollView style={{backgroundColor: 'white'}} >
          <InfoTab product={product}
            onVariantSelect={this.selectVariant}
            onAddToCart={this.props.addItemToCart}
            variantIndex={this.state.variantIndex}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  indicators: {
    flexDirection: 'row',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  }
})

const mapDispatchToProps = (dispatch) => {
  return{
    addItemToCart: (product) => dispatch({type: 'ADD_TO_CART', payload: product})
  }
}

export default connect(null, mapDispatchToProps)(Producto)
