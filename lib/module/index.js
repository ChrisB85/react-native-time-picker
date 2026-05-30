"use strict";

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableHighlight } from 'react-native';
import throttle from 'lodash.throttle';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export let Mode = /*#__PURE__*/function (Mode) {
  Mode[Mode["HOUR"] = 0] = "HOUR";
  Mode[Mode["MINUTE"] = 1] = "MINUTE";
  return Mode;
}({});
const defaultColors = {
  clockActiveColor: 'rgb(76, 175, 80)',
  clockActiveTextColor: "black",
  topActiveColor: 'rgb(200, 230, 201)',
  topInActiveColor: 'rgb(240, 240, 240)',
  topInActiveTextColor: 'rgb(97, 97, 97)'
};

// Offset (px) between outer and inner ring radii in 24h mode
const INNER_RING_OFFSET = 55;

// Outer ring: same positions as 12h clock face
const OUTER_12H_HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
// Inner ring: 0 (midnight) + 13–23
const INNER_24H_HOURS = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

/**
 * Maps an hour value to its index in the hourElements array.
 *
 * 12h: elements = [12, 1, 2, ..., 11], indices 0–11
 * 24h: elements = [12, 1, ..., 11, 0, 13, ..., 23], indices 0–23
 */
function getInitialHourIndex(hour, is24Hour) {
  if (!is24Hour) {
    if (hour === 12) return 0;
    if (hour >= 1 && hour <= 11) return hour;
    return 0;
  }
  // outer ring indices 0–11
  if (hour === 12) return 0;
  if (hour >= 1 && hour <= 11) return hour;
  // inner ring: INNER_24H_HOURS = [0, 13, 14, ..., 23] → base index 12
  if (hour === 0) return 12;
  if (hour >= 13 && hour <= 23) return hour; // 13→13, ..., 23→23
  return 0;
}
const defaultStyles = (colors, customStyles) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...StyleSheet.flatten(customStyles?.container || {})
  },
  topComponent: {
    flexDirection: 'row',
    gap: 10
  },
  topComponentText: {
    fontSize: 20,
    backgroundColor: colors.topInActiveColor,
    padding: 10,
    borderRadius: 8,
    fontWeight: '500',
    color: colors.topInActiveTextColor
  },
  clockContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10000,
    position: 'relative',
    backgroundColor: "white",
    ...StyleSheet.flatten(customStyles?.clock || {})
  },
  clock: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  inactiveNumber: {
    position: 'absolute',
    fontSize: 15,
    fontWeight: 'bold',
    height: 35,
    width: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    zIndex: 10,
    color: "white",
    ...StyleSheet.flatten(customStyles?.inActiveNumber || {})
  },
  indicatorLine: {
    width: 2,
    backgroundColor: "lightgray",
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
    height: "100%",
    ...StyleSheet.flatten(customStyles?.indicatorLine || {})
  },
  activeNumber: {
    backgroundColor: colors.clockActiveColor,
    borderRadius: 100,
    height: 35,
    width: 35,
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    ...StyleSheet.flatten(customStyles?.activeNumber || {})
  },
  centerComponent: {
    backgroundColor: colors.clockActiveColor,
    width: 10,
    height: 10,
    borderRadius: 10000,
    zIndex: 10,
    ...StyleSheet.flatten(customStyles?.centerComponent || {})
  },
  AmPmContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: colors.topInActiveColor,
    padding: 0,
    margin: 0,
    borderRadius: 6,
    overflow: "hidden"
  },
  AmPmContainerText: {
    fontSize: 12,
    paddingHorizontal: 8,
    color: colors.topInActiveTextColor,
    margin: 0,
    fontWeight: "600"
  },
  periodContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
function ElementsComponent({
  elements,
  setValue,
  center,
  step = 1,
  styles,
  customComponents,
  index,
  setIndex
}) {
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0
  });

  // Compute indicator geometry from the active element's actual position so it
  // works correctly for both single-ring (12h) and dual-ring (24h) layouts.
  const activeElement = elements[index];
  const lineHeight = activeElement && center.x > 0 ? Math.sqrt(Math.pow(activeElement.position.x - center.x, 2) + Math.pow(activeElement.position.y - center.y, 2)) - 5 : 0;
  const lineRotation = activeElement && center.x > 0 ? Math.atan2(activeElement.position.y - center.y, activeElement.position.x - center.x) * (180 / Math.PI) + 90 : 0;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [elements.map(({
      position,
      value: elementValue
    }, currIndex) => index % step === 0 && (customComponents?.NumberComponent ? /*#__PURE__*/_jsx(View, {
      style: {
        left: position.x - dimensions.width / 2,
        top: position.y - dimensions.height / 2,
        position: "absolute",
        flex: 1
      },
      onLayout: event => {
        const {
          width,
          height
        } = event.nativeEvent.layout;
        setDimensions({
          width,
          height
        });
      },
      children: /*#__PURE__*/_jsx(customComponents.NumberComponent, {
        value: elementValue,
        isActive: index === currIndex
      })
    }, currIndex) : /*#__PURE__*/_jsx(Text, {
      onPress: () => {
        setValue(elementValue);
        setIndex(currIndex);
      },
      style: [styles.inactiveNumber, index === currIndex && styles.activeNumber, {
        left: position.x - (styles?.inactiveNumber?.width || 35) / 2,
        top: position.y - (styles?.inactiveNumber?.height || 35) / 2
      }],
      children: elementValue
    }, currIndex))), /*#__PURE__*/_jsx(View, {
      pointerEvents: "none",
      style: {
        height: lineHeight,
        transform: [{
          rotate: `${lineRotation}deg`
        }],
        top: center.y - lineHeight,
        position: "absolute",
        transformOrigin: 'bottom'
      },
      children: customComponents?.Line || /*#__PURE__*/_jsx(View, {
        style: styles.indicatorLine
      })
    })]
  });
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
export default function TimePicker({
  radius,
  numberRadius = radius - 40,
  colors = defaultColors,
  initialHour = 12,
  initialMinute = 0,
  initialPeriod = 'am',
  is24Hour = false,
  customComponents,
  onValueChange,
  customStyles
}) {
  colors = {
    ...defaultColors,
    ...colors
  };
  const styles = defaultStyles(colors, customStyles);
  const containerRef = useRef(null);
  const minutes = Array.from({
    length: 12
  }, (_, i) => i * 5);
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);
  const [isHourMode, setIsHourMode] = useState(true);
  const [center, setCenter] = useState({
    x: 0,
    y: 0
  });
  const [hourElements, setHourElements] = useState([]);
  const [minuteElements, setMinuteElements] = useState([]);
  const [index, setIndex] = useState(() => getInitialHourIndex(initialHour, is24Hour));
  const handleLayout = event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numRadius = numberRadius ?? radius - 40;
    const newHourElements = [];
    const newMinuteElements = [];
    setCenter({
      x: centerX,
      y: centerY
    });
    if (is24Hour) {
      // Outer ring: 12, 1, 2, ..., 11 → element indices 0–11
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6 - Math.PI / 2;
        const x = centerX + numRadius * Math.cos(angle);
        const y = centerY + numRadius * Math.sin(angle);
        newHourElements.push({
          position: {
            x,
            y
          },
          value: OUTER_12H_HOURS[i],
          label: i,
          screenPosition: {
            x: 0,
            y: 0
          }
        });
      }
      // Inner ring: 0, 13, 14, ..., 23 → element indices 12–23
      const innerRadius = numRadius - INNER_RING_OFFSET;
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6 - Math.PI / 2;
        const x = centerX + innerRadius * Math.cos(angle);
        const y = centerY + innerRadius * Math.sin(angle);
        newHourElements.push({
          position: {
            x,
            y
          },
          value: INNER_24H_HOURS[i],
          label: i + 12,
          screenPosition: {
            x: 0,
            y: 0
          }
        });
      }
    } else {
      const hours = [12, ...Array.from({
        length: 11
      }, (_, i) => i + 1)];
      for (let i = 0; i < hours.length; i++) {
        const angle = i * Math.PI / (hours.length / 2) - Math.PI / 2;
        const x = centerX + numRadius * Math.cos(angle);
        const y = centerY + numRadius * Math.sin(angle);
        newHourElements.push({
          position: {
            x,
            y
          },
          value: hours[i],
          label: i,
          screenPosition: {
            x: 0,
            y: 0
          }
        });
      }
    }
    for (let i = 0; i < minutes.length; i++) {
      const angle = i * Math.PI / (minutes.length / 2) - Math.PI / 2;
      const x = centerX + numRadius * Math.cos(angle);
      const y = centerY + numRadius * Math.sin(angle);
      newMinuteElements.push({
        position: {
          x,
          y
        },
        value: minutes[i],
        label: i * 5,
        screenPosition: {
          x: 0,
          y: 0
        }
      });
    }
    setHourElements(newHourElements);
    setMinuteElements(newMinuteElements);
  };
  useEffect(() => {
    if (onValueChange) {
      if (is24Hour) {
        onValueChange(hour, minute);
      } else {
        onValueChange(hour, minute, period);
      }
    }
  }, [hour, minute, period]);
  const switchAnimation = useRef(new Animated.Value(1)).current;
  function switchMode(newMode) {
    Animated.timing(switchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      setIsHourMode(newMode === Mode.HOUR);
      Animated.timing(switchAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      }).start();
    });
  }
  const scaleValueForTransistion = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.2, 1]
  });
  const updateValue = (closestIndex, hourMode) => {
    setIndex(closestIndex);
    if (hourMode) {
      setHour(hourElements[closestIndex]?.value ?? 0);
    } else {
      setMinute(minuteElements[closestIndex]?.value ?? 0);
    }
  };
  const throttledUpdate = throttle(async (gestureState, elements) => {
    const positionXScreen = gestureState.moveX;
    const positionYScreen = gestureState.moveY;
    let closest = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const {
        position
      } = element;
      const distance = Math.sqrt(Math.pow(positionXScreen - position.x, 2) + Math.pow(positionYScreen - position.y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    }
    updateValue(closest, isHourMode);
  }, 50);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [customComponents?.TopComponent ? /*#__PURE__*/_jsx(customComponents.TopComponent, {
      hour: hour,
      minute: minute,
      switchMode: switchMode,
      activeMode: isHourMode ? Mode.HOUR : Mode.MINUTE,
      period: is24Hour ? undefined : period,
      setPeriod: is24Hour ? undefined : setPeriod,
      is24Hour: is24Hour
    }) : /*#__PURE__*/_jsxs(View, {
      style: styles.topComponent,
      children: [/*#__PURE__*/_jsx(Text, {
        onPress: () => switchMode(Mode.HOUR),
        style: [styles.topComponentText, isHourMode && {
          color: colors.topActiveTextColor,
          backgroundColor: colors.topActiveColor
        }],
        children: hour.toString().padStart(2, '0')
      }), /*#__PURE__*/_jsx(Text, {
        onPress: () => switchMode(Mode.MINUTE),
        style: [styles.topComponentText, !isHourMode && {
          color: colors.topActiveTextColor,
          backgroundColor: colors.topActiveColor
        }],
        children: minute.toString().padStart(2, '0')
      }), !is24Hour && /*#__PURE__*/_jsx(TouchableHighlight, {
        onPress: () => {
          setPeriod(prev => prev === "am" ? "pm" : "am");
        },
        style: styles.AmPmContainer,
        children: /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(View, {
            style: [styles.periodContainer, period === 'am' && {
              backgroundColor: colors.topActiveColor
            }],
            children: /*#__PURE__*/_jsx(Text, {
              style: [styles.AmPmContainerText, period === 'am' && {
                color: colors.topActiveTextColor
              }],
              children: "AM"
            })
          }), /*#__PURE__*/_jsx(View, {
            style: [styles.periodContainer, period === 'pm' && {
              backgroundColor: colors.topActiveColor
            }],
            children: /*#__PURE__*/_jsx(Text, {
              style: [styles.AmPmContainerText, period === 'pm' && {
                color: colors.topActiveTextColor
              }],
              children: "PM"
            })
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(View, {
      onStartShouldSetResponder: () => true,
      onTouchEnd: e => {
        e.stopPropagation();
      },
      children: /*#__PURE__*/_jsxs(View, {
        ref: containerRef,
        onStartShouldSetResponder: () => true,
        onTouchStart: event => {
          throttledUpdate({
            moveX: event.nativeEvent.locationX,
            moveY: event.nativeEvent.locationY
          }, isHourMode ? hourElements : minuteElements);
        },
        onTouchMove: event => {
          throttledUpdate({
            moveX: event.nativeEvent.locationX,
            moveY: event.nativeEvent.locationY
          }, isHourMode ? hourElements : minuteElements);
        },
        onTouchEnd: event => {
          if (isHourMode) {
            throttledUpdate({
              moveX: event.nativeEvent.locationX,
              moveY: event.nativeEvent.locationY
            }, isHourMode ? hourElements : minuteElements);
            switchMode(Mode.MINUTE);
          }
        },
        style: [styles.clockContainer, {
          height: radius * 2,
          width: radius * 2
        }],
        onLayout: handleLayout,
        children: [customComponents?.CenterComponent || /*#__PURE__*/_jsx(View, {
          style: styles.centerComponent
        }), /*#__PURE__*/_jsx(Animated.View, {
          pointerEvents: "none",
          style: [styles.clock, {
            opacity: switchAnimation,
            transform: [{
              scale: scaleValueForTransistion
            }]
          }],
          children: /*#__PURE__*/_jsx(ElementsComponent, {
            value: isHourMode ? hour : minute,
            setValue: isHourMode ? setHour : setMinute,
            elements: isHourMode ? hourElements : minuteElements,
            center: center,
            step: 1,
            styles: styles,
            customComponents: {
              Line: customComponents?.LineComponent,
              EndComponent: customComponents?.EndComponent,
              NumberComponent: customComponents?.NumberComponent
            },
            setIndex: setIndex,
            index: index
          })
        })]
      })
    })]
  });
}
//# sourceMappingURL=index.js.map