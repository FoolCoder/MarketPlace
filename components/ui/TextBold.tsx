import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';
import Fonts from '../../constant/Fonts';

interface CustomProps {
  style?: TextStyle;
  children?: string;
}
export default function TextBold(props: CustomProps) {
  const {colors} = useTheme();

  const text: TextStyle = {
    color: 'white',
    fontWeight: 'bold',
    // fontFamily:""
  };

  const {style, children} = props;
  let fontSize = wp('4%');
  let lineHeight = wp('5.5%');

  if (style && style.fontSize) {
    fontSize = wp(style.fontSize);
  }
  if (style && style.fontSize) {
    lineHeight = wp(style.fontSize) + wp('1%');
  }
  if (style && style.lineHeight) {
    lineHeight = style.lineHeight;
  }
  return (
    <Text
      style={{
        ...text,
        ...props.style,
        fontFamily: Fonts.SourceSansBold,
        ...{fontSize, lineHeight},
      }}>
      {children}
    </Text>
  );
}
