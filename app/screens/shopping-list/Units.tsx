import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {Chip, Text} from 'react-native-paper';
import {View, ViewStyle} from 'react-native';
import {translate} from '../../i18n/translate';

type MeasurementSystem = 'imperial' | 'metric';

type UnitsType = {
  measurementSystem: MeasurementSystem;
  setUnit: (unit: string) => void;
};

const Units: FC<UnitsType> = observer(_props => {
  const {measurementSystem, setUnit} = _props;
  const liquid =
    measurementSystem === 'imperial'
      ? translate('Units.Imperial.gal')
      : translate('Units.Metric.l');

  const microLiquid =
    measurementSystem === 'imperial'
      ? translate('Units.Imperial.oz')
      : translate('Units.Metric.ml');

  const weight =
    measurementSystem === 'imperial'
      ? translate('Units.Imperial.lb')
      : translate('Units.Metric.kg');

  return (
    <View style={$unitSuggestionContainer}>
      <Text variant="labelLarge">Unit</Text>
      <Chip
        mode={'flat'}
        onPress={() => {
          setUnit(liquid);
        }}>
        {liquid}
      </Chip>
      <Chip
        mode={'flat'}
        onPress={() => {
          setUnit(microLiquid);
        }}>
        {microLiquid}
      </Chip>
      <Chip
        mode={'flat'}
        onPress={() => {
          setUnit(weight);
        }}>
        {weight}
      </Chip>
      <Chip
        mode={'flat'}
        onPress={() => {
          setUnit('pkg');
        }}>
        pkg
      </Chip>
    </View>
  );
});

const $unitSuggestionContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 16,
  marginVertical: 8,
  columnGap: 8,
};

export default Units;
