import React from 'react'
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import { create_ads } from '../../redux/actions/authAction';
import storage from '@react-native-firebase/storage'
import { firebase } from '@react-native-firebase/auth';


export default function Ads({ navigation }) {

  const [uri, setUri] = React.useState(null)
  const [category, setCategory] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [discription, setDiscription] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [city, setCity] = React.useState('')
  const [id, setId] = React.useState(null)
  const [uploading, setUploading] = React.useState(false)
  const [transeferred, setTranseferred] = React.useState(0)
  const dispatch = useDispatch()

  const CreateAds = async ()  => {
    const imageUrl = await  hondlet()
    console.log(`Adss Image ${imageUrl}`)
     let user =  {
      category,
      title,
      discription,
      price,
      city,
      imageUrl
    }
    dispatch(create_ads(user))
  }

  const ImageGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image.path);
      setUri(image.path)
    });
  }

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        setId(user.uid)


      } else {
        // User not logged in or has just logged out.
      }
    });
  })

  const submitPost = async () => {

  }

  const hondlet = async () => {
    const uploadUri = uri;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

    const extansion = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extansion;

    setUploading(true);
    setTranseferred(0)

    const storageRef = storage().ref(`photos/${id}`)
    const task = storageRef.putFile(uploadUri)

    task.on('state_changed', taskSnapshot => {
      setTranseferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
      )
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL()

      setUploading(false)
      alert('your immage uploaded success fully')
      return url;
    } catch (e) {
      console.log(e)
    }
    setUri(null)
  }

  return (
    <ScrollView style={{ flex: 1, }}>
      <View style={styles.MainView}>
        {/* icon back */}
        <View>
          <View>
            <TouchableOpacity onPress={navigation.goBack}>
              <Text style={styles.IconView}><Feather name='arrow-left' style={styles.BackIcon} size={25} /></Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.CreateAd}>Create Ad</Text>
          <Text style={styles.Advertisments}>Create new advertisement</Text>
        </View>
        <View style={styles.Categories}>
          <Text style={styles.CategoriesHeading}>CATEGORY</Text>
          <TextInput
            placeholder='Select a category'
            onChangeText={(text) => setCategory(text)}
            value={category}
            style={styles.Input} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.AdTitle}>AD TITLE</Text>
          <TextInput
            onChangeText={(text) => setTitle(text)}
            value={title}
            style={styles.Input} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.AdTitle}>DISCRIPTION</Text>
          <TextInput
            onChangeText={(text) => setDiscription(text)}
            value={discription}
            style={styles.Input} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.AdTitle}>PRICE</Text>
          <TextInput
            onChangeText={(text) => setPrice(text)}
            value={price}
            style={styles.Input} />
        </View>
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <Text style={styles.AdTitle}>CITY</Text>
          <TextInput
            onChangeText={(text) => setCity(text)}
            value={city}
            placeholder='Select City'
            style={styles.Input} />
        </View>
        <TouchableOpacity onPress={ImageGallery}>
          <Text>
            Enter you images
          </Text>
        </TouchableOpacity>
        <Image
          style={{ height: 120, width: 100, borderRadius: 5 }}
          source={{ uri: uri }}
        />
      </View>
      <TouchableOpacity onPress={CreateAds}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          padding: 20, color: '#b3b3b3', backgroundColor: "#00aa49",
          marginTop: 20,
          paddingVertical: 25
        }}>
          <Text style={{ fontSize: 14, color: '#1d1900' }}>Create Ads</Text>
          <Feather name="arrow-right" size={20} color="#1d1900" />
        </View>
      </TouchableOpacity>

      {uploading ? (
        <View>
          <Text>{transeferred} % Completed</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={submitPost}>
          <Text>Post</Text>
        </TouchableOpacity>
      )
      }

    </ScrollView >
  )
}


const styles = StyleSheet.create({
  MainView: {
    paddingLeft: 13,
    paddingRight: 13,
    backgroundColor: 'white'
  },
  IconView: {
    marginTop: 10
  },
  BackIcon: {
    color: 'black'
  },
  CreateAd: {
    marginTop: 10,
    color: 'black',
    fontSize: 25
  },
  Advertisments: {
    marginTop: 5,
    color: '#b1b1b1',
    fontWeight: 'bold'
  },
  Categories: {
    marginTop: 30
  },
  CategoriesHeading: {
    color: '#8B8B8B',
    marginBottom: 5,
    fontSize: 13,
    opacity: 0.7,
    fontWeight: 'bold'
  },
  Input: {
    padding: 15,
    backgroundColor: '#f7f7f7',
    fontWeight: 'bold',
    opacity: 0.7,
    color: '#ababab',
    fontSize: 15,
    fontFamily: 'Roboto'
  },
  AdTitle: {
    color: '#8B8B8B',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 13,
    opacity: 0.7
  }

})
