import Svg, { Circle, G, Rect } from 'react-native-svg';

const SKY = '#8FD3EE';
const BUILDING = '#E1573C';
const BUILDING_SHADE = '#C8462E';
const AWNING = '#FFF6E9';
const TREE = '#4FA05C';
const TRUNK = '#7A4B2A';
const SKIN = '#CE9767';
const HAIR = '#241A10';
const SHIRT_BARBER = '#3B6FA0';
const CAPE = '#FFF6E9';

export default function ShopScene() {
  const scallopCount = 9;
  const scallopW = 340 / scallopCount;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 340 190" preserveAspectRatio="xMidYMid slice">
      <Rect x={0} y={0} width={340} height={95} fill={SKY} />
      <Circle cx={296} cy={30} r={16} fill="#FFE9B0" opacity={0.9} />
      <Rect x={0} y={78} width={340} height={112} fill={BUILDING} />

      {Array.from({ length: scallopCount }).map((_, i) => (
        <Circle
          key={i}
          cx={i * scallopW + scallopW / 2}
          cy={80}
          r={scallopW / 2}
          fill={AWNING}
        />
      ))}

      <Rect x={16} y={95} width={16} height={62} fill={TRUNK} rx={3} />
      <Circle cx={24} cy={78} r={30} fill={TREE} />
      <Circle cx={2} cy={92} r={20} fill={TREE} />
      <Circle cx={46} cy={92} r={20} fill={TREE} />

      <Rect x={120} y={110} width={100} height={80} rx={6} fill={BUILDING_SHADE} />

      <G>
        <Rect x={155} y={168} width={44} height={7} rx={3} fill="#9AA0A6" />
        <Rect x={160} y={175} width={6} height={14} fill="#7A7F84" />
        <Rect x={188} y={175} width={6} height={14} fill="#7A7F84" />
        <Rect x={162} y={130} width={30} height={44} rx={10} fill={CAPE} />
        <Circle cx={177} cy={118} r={13} fill={SKIN} />
        <Rect x={166} y={106} width={22} height={11} rx={6} fill={HAIR} />
      </G>

      <G>
        <Rect x={222} y={135} width={22} height={55} rx={8} fill={SHIRT_BARBER} />
        <Circle cx={233} cy={122} r={13} fill={SKIN} />
        <Rect x={222} y={110} width={22} height={11} rx={6} fill={HAIR} />
        <Rect x={196} y={132} width={22} height={8} rx={4} fill={SKIN} transform="rotate(-18 196 132)" />
      </G>
    </Svg>
  );
}
