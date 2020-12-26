input.onButtonPressed(Button.A, function () {
    basic.showArrow(ArrowNames.West)
    BitLabo.サーボ移動(AnalogPin.P1, 180, AnalogPin.P0, 180, speed)
})
input.onButtonPressed(Button.AB, function () {
    basic.showArrow(ArrowNames.North)
    BitLabo.サーボ移動(AnalogPin.P1, 90, AnalogPin.P0, 90, speed)
    BitLabo.数字表示max99(BitLabo.サーボs1の値())
})
input.onButtonPressed(Button.B, function () {
    basic.showArrow(ArrowNames.East)
    BitLabo.サーボ移動(AnalogPin.P1, 0, AnalogPin.P0, 0, speed)
    BitLabo.数字表示max99(BitLabo.サーボs1の値())
})
let speed = 0
BitLabo.サーボ変数設定(AnalogPin.P0, 0, AnalogPin.P1, 0)
basic.pause(2000)
let x = 90
let y = 90
BitLabo.サーボ移動(AnalogPin.P0, x, AnalogPin.P1, y, 10)
BitLabo.数字表示max99(BitLabo.サーボs1の値())
speed = 200
