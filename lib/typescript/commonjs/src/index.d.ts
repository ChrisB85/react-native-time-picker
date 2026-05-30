import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
type CustomStyles = {
    container?: StyleProp<ViewStyle>;
    clock?: StyleProp<ViewStyle>;
    activeNumber?: StyleProp<TextStyle>;
    clockText?: StyleProp<TextStyle>;
    indicatorLine?: StyleProp<ViewStyle>;
    inActiveNumber?: StyleProp<TextStyle>;
    centerComponent?: StyleProp<ViewStyle>;
};
export type Colors = {
    clockActiveColor?: string;
    clockActiveTextColor?: string;
    topActiveColor?: string;
    topInActiveColor?: string;
    topActiveTextColor?: string;
    topInActiveTextColor?: string;
};
export declare enum Mode {
    HOUR = 0,
    MINUTE = 1
}
/**
 * TimePicker Component
 *
 * A customizable clock-style time picker that supports hours, minutes, and
 * optionally period (AM/PM) or 24-hour format.
 *
 * @param {number} props.radius - The radius of the clock circle.
 * @param {number} [props.numberRadius] - Radius for positioning clock numbers (default: radius - 40).
 * @param {Object} [props.colors] - Custom colors for the clock elements.
 * @param {number} [props.initialHour=12] - Initial hour. 1–12 for 12h mode; 0–23 for 24h mode.
 * @param {number} [props.initialMinute=0] - Initial minute value.
 * @param {'am' | 'pm'} [props.initialPeriod='am'] - Initial period (12h mode only).
 * @param {boolean} [props.is24Hour=false] - Enable 24-hour mode. Shows inner+outer rings; hides AM/PM.
 * @param {Object} [props.customComponents] - Custom components for various clock parts.
 * @param {Object} [props.customStyles] - Custom styles for the TimePicker.
 * @param {Function} [props.onValueChange] - Callback on time change.
 *   In 12h mode: (hour, minute, period). In 24h mode: (hour, minute) — period is undefined.
 */
export default function TimePicker({ radius, numberRadius, colors, initialHour, initialMinute, initialPeriod, is24Hour, customComponents, onValueChange, customStyles, }: {
    radius: number;
    numberRadius?: number;
    colors?: Colors;
    initialHour?: number;
    initialMinute?: number;
    initialPeriod?: 'am' | 'pm';
    is24Hour?: boolean;
    customComponents?: {
        CenterComponent?: React.ReactNode;
        LineComponent?: React.ReactNode;
        EndComponent?: React.ReactNode;
        NumberComponent?: (props: {
            value: number;
            isActive: boolean;
        }) => React.ReactNode;
        TopComponent?: (props: {
            hour: number;
            minute: number;
            switchMode: (mode: Mode) => void;
            activeMode: Mode;
            period?: 'am' | 'pm';
            setPeriod?: (period: 'am' | 'pm') => void;
            is24Hour: boolean;
        }) => React.ReactNode;
    };
    customStyles: CustomStyles;
    onValueChange?: (hour: number, minute: number, period?: 'am' | 'pm') => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map