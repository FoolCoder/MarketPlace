import React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import {wp} from '../common/Responsive';
interface Props {
  placeholder: any;
  show?: boolean;
  onChangeText?: (arg: string | undefined) => void;
  value?: string;
}
const TextField = (props: Props) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textField}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: '#EFEFF1',
    borderBottomWidth: 1,
    paddingBottom: Platform.OS == 'ios' ? wp(3) : 0,
    width: wp(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textField: {
    width: wp(70),
  },
});
export default TextField;
