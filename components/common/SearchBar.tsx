import React, {useState, useRef, LegacyRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {hp, wp} from './Responsive';
interface Search {
  focus: boolean;
  handleSearch: (str: string) => void;
  onFocus: (e: boolean) => void;
  onBlur: (e: boolean) => void;
}

function SearchBar(props: Search) {
  const textRef = useRef<LegacyRef<any>>(null);

  return (
    <SafeAreaView>
      <View style={styles.SearchView}>
        <MaterialIcons
          name="search"
          color={'grey'}
          size={25}
          style={{marginLeft: wp(3)}}
        />
        <TextInput
          // ref={textRef}
          style={{left: 5, width: wp(70), color: '#000'}}
          placeholderTextColor={'grey'}
          onFocus={() => props.onFocus(!props.focus)}
          onBlur={() => {
            props.onBlur(!props.focus);
            // textRef.current.clear();
          }}
          placeholder="What are you looking for?"
          onChangeText={text => {
            props.handleSearch(text);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  SearchView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: wp(85),
    alignSelf: 'center',
    zIndex: 1,
    top: hp(-2.5),
    borderRadius: 25,
    // height: wp(10),
    justifyContent: 'flex-start',
    elevation: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    alignItems: 'center',
  },
});

export default SearchBar;
