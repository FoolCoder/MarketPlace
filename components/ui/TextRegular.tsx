import React from 'react';
import {Text, TextStyle} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';
import Fonts from '../../constant/Fonts';

interface CustomProps {
  style?: TextStyle;
  children?: JSX.Element | JSX.Element[] | string | string[];
}
export default function TextRegular(props: CustomProps) {
  const {colors} = useTheme();

  const text = {
    color: 'white',
    // fontFamily: Fonts.ManropeRegular,
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
        fontFamily: Fonts.SourceSansRegular,
        ...{fontSize, lineHeight},
      }}>
      {children}
    </Text>
  );
}
