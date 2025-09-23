import React, { useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text, HStack, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import { background } from 'native-base/lib/typescript/theme/styled-system';

interface CustomCollapsibleProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  count?: number;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  headerStyle?: any;
  level?: 'primary' | 'secondary';
}

export const CustomCollapsible: React.FC<CustomCollapsibleProps> = ({
  children,
  title,
  subtitle,
  count,
  isExpanded = false,
  onToggle,
  headerStyle,
  level = 'primary'
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [animationValue] = useState(new Animated.Value(isExpanded ? 1 : 0));

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);

    Animated.timing(animationValue, {
      toValue: newExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateInterpolate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const heightInterpolate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const getHeaderStyles = () => {
    const baseStyles = {
      paddingVertical: level === 'primary' ? 14 : 12,
      paddingHorizontal: level === 'primary' ? 18 : 16,
      borderRadius: level === 'primary' ? 10 : 8,
      marginBottom: level === 'primary' ? 0 : 0,
      borderLeftWidth: level === 'primary' ? 4 : 3,
      borderLeftColor: level === 'primary' ? '#6600CC' : '#9933ff',
    };

    if (level === 'primary') {
      return {
        ...baseStyles,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      };
    } else {
      return {
        paddingRight: 5,
      };
    }
  };

  return (
    <View >
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        style={[getHeaderStyles()]}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" flex={1}>
            <Animated.View
              style={{
                transform: [{ rotate: rotateInterpolate }],
                marginRight: 12,
              }}
            >
              <Icon
                name="chevron-right"
                size={level === 'primary' ? 20 : 18}
                color={level === 'primary' ? '#6600CC' : '#9933ff'}
              />
            </Animated.View>
            
            <VStack flex={1}>
              <Text
                fontSize={level === 'primary' ? 16 : 14}
                fontWeight={level === 'primary' ? 700 : 600}
                color="#2E2F34"
                numberOfLines={1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  fontSize={12}
                  color="#666"
                  numberOfLines={1}
                  mt={1}
                >
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>

          {count !== undefined && (
            <View
              style={{
                backgroundColor: level === 'primary' ? '#6600CC' : '#9933ff',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Text
                fontSize={11}
                fontWeight="600"
                color="#fff"
              >
                {count}
              </Text>
            </View>
          )}
        </HStack>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: heightInterpolate,
          transform: [
            {
              scaleY: heightInterpolate,
            },
          ],
        }}
      >
        {expanded && (
          <View
            style={{
              overflow: 'hidden',
            }}
          >
            {children}
          </View>
        )}
      </Animated.View>
    </View>
  );
};
