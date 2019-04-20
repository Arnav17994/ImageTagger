import React from 'react';
import { StyleSheet, Image, View, Button, ScrollView, Text, Dimensions, ActivityIndicator } from 'react-native';
import {ImagePicker, Permissions} from 'expo'
import axios from 'axios'

const {width} = Dimensions.get('window')

export default class App extends React.Component {

  state = {
    galleryImage: null,
    upload_id: null, 
    tags: null,
    isLoading: false
  }

  openGallery = async () => {
    let galleryImage = await ImagePicker.launchImageLibraryAsync({base64: true, quality: 0.15})
    console.log(galleryImage)
    if (!galleryImage.cancelled) {
      this.setState({ galleryImage });
    }
  }

  uploadImage() {
    this.setState({isLoading: true})
    const formData = new FormData()
    formData.append('image_base64', this.state.galleryImage.base64)
    axios({
      url: "https://api.imagga.com/v2/uploads",
      method: 'POST',
      headers: {
        "Authorization": "Basic YWNjX2IxYmRhMzRiYjM1ZmFiNTo5Njg1NjNiMTMwODViYzAyZDgyZWFmOGU2ZWQyODU3MA=="
      },
      data: formData
    })
    .then(response => this.setState({upload_id: response.data.result.upload_id}))
    .then(() => this.getTags())
    .then(() => this.setState({isLoading: false}))
  }

  getTags = () => {
    axios({
      url: `https://api.imagga.com/v2/tags?image_upload_id=${this.state.upload_id}`,
      method: 'GET',
      headers: {
        "Authorization": "Basic YWNjX2IxYmRhMzRiYjM1ZmFiNTo5Njg1NjNiMTMwODViYzAyZDgyZWFmOGU2ZWQyODU3MA=="
      },
    }).then(response => this.setState({
      tags: response.data.result.tags.filter(item => item.confidence > 25)}))
}

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return (
      <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
            {
              this.state.galleryImage ? 
              <Image source={{uri: this.state.galleryImage.uri}} style={{width: width, height: 400}} />
              :
              <View style={styles.imagePlaceholder}>
                <Text style={{color: '#a9a9a9', fontSize: 20}}>No Image Selected</Text>
              </View>
            }
        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', padding: 20}}>
        <Button title="Select Image" onPress={() => this.openGallery()} />
        <Button title="Get Tags" onPress={() => this.uploadImage()} />
        </View>
        <View>
            {
              this.state.tags &&
              this.state.tags.map((item, index) => <View key={index} style={styles.tagsContainer}><Text style={{marginLeft: 10, color: "#fff"}}>{item.tag.en}</Text></View>)
            }
        </View>
        {
          this.state.isLoading && <ActivityIndicator size="large" color="#865CD6"/>
        }
        </ScrollView>
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
  tagsContainer: {
    margin: 5, 
    padding: 5, 
    height: 30, 
    borderRadius: 15, 
    justifyContent: 'center', 
    backgroundColor: "#865CD6", 
    alignItems: 'center'
  },
  imagePlaceholder: {
    height: 400, 
    width: width, 
    backgroundColor: '#e7e7e7', 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});
