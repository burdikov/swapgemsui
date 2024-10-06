import {HapticButton} from "./Haptics";

const divStyle = {paddingRight: '1px', paddingLeft: '1px'}

export default function StatedButton(
    {
        state,
        pressed,
        onPress,
        onDepress,
        ...args
    }
) {
    return (
        <div style={divStyle}>
            <HapticButton
                {...args}
                mode={pressed ? 'filled' : 'plain'}
                onClick={() => {
                    pressed ? onDepress(state) : onPress(state)
                }}
            />
        </div>
    )
}