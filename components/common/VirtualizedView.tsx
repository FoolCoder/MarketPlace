import React, {ReactElement, ReactNode} from 'react';
import {FlatList, View} from 'react-native';

interface Props {
  children: JSX.Element | JSX.Element[] | React.ReactChildren;
}

export default function VirtualizedView(props: Props) {
  return (
    <FlatList
      nestedScrollEnabled
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => 'dummy'}
      renderItem={null}
      ListHeaderComponent={() => <>{props.children}</>}
      ListFooterComponent={<View style={{height: 20}} />}
    />
  );
}
