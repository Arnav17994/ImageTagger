import React from 'react';
import { StyleSheet, Image, View, Button } from 'react-native';
import {ImagePicker, Permissions} from 'expo'
import axios from 'axios'
const uuidv4 = require('uuid/v4')

export default class App extends React.Component {

  state = {
    galleryImage: null,
  }

  tagsArray = []

  openGallery = async () => {
    let galleryImage = await ImagePicker.launchImageLibraryAsync({base64: true, quality: 0.15})
    console.log(galleryImage)
    if (!galleryImage.cancelled) {
      this.setState({ galleryImage });
    }
  }

  uploadImage() {
    // let image_base64 = this.state.galleryImage.base64.toString()

    axios(`https://api.imagga.com/v2/uploads`, {
      method: 'post',
      headers: {
        "Authorization": "Basic YWNjX2IxYmRhMzRiYjM1ZmFiNTo5Njg1NjNiMTMwODViYzAyZDgyZWFmOGU2ZWQyODU3MA==",
      },
      data: {
        "image_base64": this.state.galleryImage.base64
      }
    })
    .then(response => console.log(response))
    // .then(response => response && response.result.tags.map((item, index) => 
    //   tagsArray.push({key: index, tag: item.tag.en, confidence: item.confidence}))
    //   )
    .catch(error => console.log(error))
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 3}}>
            {
              this.state.galleryImage && 
              <Image source={{uri: this.state.galleryImage.uri}} style={{width: 400, height: 400}} />
            }
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
        <Button title="Select Image" onPress={() => this.openGallery()} />
        <Button title="Get Tags" onPress={() => this.uploadImage()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginVertical: 20
  },
});
