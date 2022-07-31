import React, {useRef} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import {hp, wp} from '../common/Responsive';
import DisableEye from '../../assets/authicons/disableEye.svg';
import ActiveEye from '../../assets/authicons/activeEye.svg';
import DropDownPicker, {ValueType} from 'react-native-dropdown-picker';
import TextRegular from './TextRegular';
import {checkFakeNumber} from '../../utils';
import store from '../../redux/store';

interface propsInterface {
  keyboardType?: KeyboardTypeOptions | undefined;
  hidePasswordStrength: boolean;

  childState: boolean;
  field: {
    name: string;
    onBlur: (e: string) => void;
    onChange: (value: string) => (name: string) => (text: string) => void;
    value: string | undefined;
    defaultValue: string | undefined;
  };
  form: {
    errors: any;
    touched: any;
    setFieldTouched: (e: string) => void;
    setFieldValue: (T: string, U: string) => void;
  };
  eye: boolean;
  countryCode?: string | undefined;
  setEye: (arg: boolean) => void;
  setEdit: (arg: boolean) => void;
  edit?: boolean;
}

const CustomInput = (props: propsInterface) => {
  const inputRef = useRef(null);
  const {
    field: {name, onBlur, onChange, value, defaultValue},
    form: {errors, touched, setFieldTouched, setFieldValue},
    eye,
    setEye,
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <>
      <View style={styles.inputContainer}>
        {props?.countryCode && (
          <View
            style={{
              marginRight: wp(1),
              marginBottom: Platform.OS == 'android' ? wp(0.2) : -0.2,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}>
              {props.countryCode}
            </Text>
          </View>
        )}
        {/* // name != 'phone' // ? true // : name == 'phone' && value?.slice(3, 8)
        == checkFakeNumber // ? true // : false */}
        <TextInput
          ref={inputRef}
          keyboardType={props?.keyboardType}
          editable={
            name != 'mobilenumber' && name != 'Email'
              ? true
              : name == 'mobilenumber' &&
                store.getState().authReducer?.user?.phone?.slice(4, 9) ==
                  checkFakeNumber
              ? true
              : false
          }
          selectTextOnFocus={true}
          style={[styles.textInput, hasError && styles.errorInput]}
          // value={value}
          defaultValue={defaultValue}
          // onFocus={() => {
          //   props.edit = true;
          // }}
          secureTextEntry={
            (name == 'password' ||
              name == 'cpassword' ||
              name == 'npassword') &&
            !props.eye
          }
          onChangeText={text => {
            onChange(name)(text);
          }}
          onBlur={() => {
            setFieldTouched(name);
            onBlur(name);
          }}
          maxLength={name == 'mobilenumber' || name == 'phoneNum' ? 10 : 250}
          {...inputProps}
        />
        {(name == 'password' || name == 'cpassword' || name == 'npassword') && (
          <TouchableOpacity onPress={() => props.setEye!(!props.eye)}>
            {props.eye ? <ActiveEye /> : <DisableEye />}
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={[styles.errorText]}>{errors[name]}</Text>}
    </>
  );
};
const CustomPicker = (props: propsInterface) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);

  const {
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched, setFieldValue},
    eye,
    setEye,
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <>
      <View
        style={{
          marginBottom: wp(2),
          // left: 10,
        }}>
        <DropDownPicker
          listMode="SCROLLVIEW"
          placeholder="Gender"
          containerStyle={{
            height: open ? 110 : 30,
            width: wp(87),
          }}
          dropDownContainerStyle={{
            left: -6,
            width: wp(88),
          }}
          open={open}
          value={value as keyof ValueType}
          items={items}
          setOpen={setOpen}
          setValue={(value: any) => setFieldValue(name, value())}
          setItems={setItems}
          selectedItemLabelStyle={{color: 'black'}}
          placeholderStyle={{
            color: 'grey',
            marginLeft: !open ? wp(-1.2) : -8,
            fontSize: wp(4.1),
          }}
          labelStyle={{marginLeft: wp(-1)}}
          style={{
            height: 25,
            maxHeight: 40,
            borderWidth: 0,
            borderBottomWidth: 1,
            marginHorizontal: 0,
            borderColor: '#949494',
            marginLeft: !open ? wp(-1.5) : wp(-0.5),
            backgroundColor: 'transparent',
          }}
        />
      </View>

      {hasError && <Text style={[styles.errorText1]}>{errors[name]}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#949494',
    borderBottomWidth: 1,
    width: wp(85),
    alignItems: 'center',
    alignSelf: 'center',
    height: wp(7),
  },
  textInput: {
    width: wp(75),
    textAlignVertical: 'center',
    color: 'black',
    ...Platform.select({
      ios: {
        height: wp(6),
      },
      android: {
        height: hp(6),
      },
    }),
    fontSize: 16,
  },
  errorText: {
    fontSize: wp(3),
    color: 'red',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    width: wp(85),
    // left: 10,
    // borderWidth: 1,
    // marginBottom: wp(-1),
  },
  errorText1: {
    fontSize: wp(3),
    color: 'red',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    width: wp(85),
    top: -14,
    // marginBottom: wp(-1),
  },
  errorInput: {
    borderColor: 'red',
  },
});

export {CustomInput, CustomPicker};
