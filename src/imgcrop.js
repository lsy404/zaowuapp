import ImagePicker from 'react-native-image-crop-picker';
import React, { Component } from 'react';

export async function imgcroper(uri){
        let image=await ImagePicker.openCropper({
             path: uri,
             width: 290,
             height: 370
        });
        return await image.path;
}