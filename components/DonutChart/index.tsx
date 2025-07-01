import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

export const DonutChart = ({ data, width, height, innerRadius, colorScale, style, name }) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const total = data.reduce((acc, item) => acc + item.y, 0);

    // Check if there's only one non-zero value and handle it as 100%
    const more = data.filter(item => item.y > 0);
    const hasSingleNonZeroValue = more.length === 1;

    const adjustedData = hasSingleNonZeroValue
        ? data.map(item => ({ ...item, y: item.y > 0 ? 1 : 0 }))
        : data;

    let startAngle = 0;

    const renderSlices = () => {
        if (hasSingleNonZeroValue) {
            const item = adjustedData.find(item => item.y > 0);
            const { x, y } = item;
            const angle = 360;
            const largeArcFlag = angle > 180 ? 1 : 0;

            const start = polarToCartesian(centerX, centerY, radius, startAngle);
            const end = polarToCartesian(centerX, centerY, radius, startAngle + angle);

            // Round the coordinates to avoid precision issues
            const startRounded = { x: Math.round(start.x * 100) / 100, y: Math.round(start.y * 100) / 100 };
            const endRounded = { x: Math.round(end.x * 100) / 100, y: Math.round(end.y * 100) / 100 };

            const pathData = [
                `M ${startRounded.x} ${startRounded.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endRounded.x} ${endRounded.y}`,
                `L ${centerX} ${centerY}`,
                `L ${startRounded.x} ${startRounded.y}`
            ].join(' ');

            return (
                <G key={0}>
                    <Path d={pathData} fill={colorScale[data.indexOf(item)]} />
                    {style.labels.fontSize > 0 && (
                        <SvgText
                            fill={style.labels.fill}
                            fontSize={style.labels.fontSize}
                            x={(startRounded.x + endRounded.x + 2 * centerX) / 4}
                            y={(startRounded.y + endRounded.y + 2 * centerY) / 4}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {x}
                        </SvgText>
                    )}
                </G>
            );
        } else {
            // Handle the normal case with multiple values
            return adjustedData.map((item, index) => {
                const { x, y } = item;
                const value = y;
                const percentage = (value / (total === 0 ? 1 : total)) * 100;
                const angle = (percentage / 100) * 360;
                const largeArcFlag = angle > 180 ? 1 : 0;

                const start = polarToCartesian(centerX, centerY, radius, startAngle);
                const end = polarToCartesian(centerX, centerY, radius, startAngle + angle);

                const pathData = [
                    `M ${start.x} ${start.y}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                    `L ${centerX} ${centerY}`,
                    `L ${start.x} ${start.y}`
                ].join(' ');

                startAngle += angle;

                return (
                    <G key={index}>
                        <Path d={pathData} fill={colorScale[index]} />
                        {style.labels.fontSize > 0 && (
                            <SvgText
                                fill={style.labels.fill}
                                fontSize={style.labels.fontSize}
                                x={(start.x + end.x + 2 * centerX) / 4}
                                y={(start.y + end.y + 2 * centerY) / 4}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {x}
                            </SvgText>
                        )}
                    </G>
                );
            });
        }
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {hasSingleNonZeroValue ?
                <Svg width={width} height={height}>
                    <Circle
                        cx={centerX}
                        cy={centerY}
                        r={radius} 
                        fill="transparent"
                        strokeWidth={20}
                    />
                    {/* Círculo preenchido */}
                    <Circle
                        cx={centerX}
                        cy={centerY}
                        stroke={more[0].x == 'Concluídas' ? '#00C49F' : more[0].x == 'Em Andamento' ? '#FFBB28' : more[0].x == 'Pendente' ? '#0088FE' : '#FF8042'}
                        r={innerRadius} 
                        fill="white"
                        strokeWidth={20}
                    />
                </Svg>
                :
                <Svg width={width} height={height}>
                    <Circle cx={centerX} cy={centerY} r={radius} fill="transparent" />
                    {renderSlices()}
                    <Circle cx={centerX} cy={centerY} r={innerRadius} fill="white" />
                </Svg>
            }
        </View>
    );
};