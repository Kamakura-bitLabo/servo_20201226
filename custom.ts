/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://makecode.microbit.org/blocks/custom
*/
enum selectMode {
    //% block="Microbit"
    Microbit = 1,
    //% block="シミュレータ"
    Simulator = 0
}
/**
* makecode WhaleySans Font Package.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/
let FONT = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1]
]
let img: Image = null
img = images.createImage(`
. . . . .
. . . . .
. . . . .
. . . . .
. . . . .
`)
/**
 * カスタムブロック
 */
//% weight=100 color=#0fbc11 icon=""
namespace BitLabo {
    let __angle13 = 90
    let __angle14 = 5
    let __x = 90
    let __y = 90
    let __servo1 = AnalogPin.P0
    let __servo2 = AnalogPin.P1
    /**
     * 音声合成の設定
     * @param outPin 通信端子, eg: P8
     * @param inPin 受信端子, eg: USB_RX
     * @param speed 通信速度, eg: 9600
     */
    //% block="音声合成の設定 通信端子 %outPin 受信端子 %inPin 通信速度 %speed"
    //% outPin.defl=SerialPin.P8
    //% inPin.defl=SerialPin.USB_RX
    //% speed.defl=BaudRate.BaudRate9600
    //% weight=100
    //% group="音声合成"
    export function 音声合成設定(outPin: SerialPin, inPin: SerialPin, speed: BaudRate) {
        serial.redirect(
            outPin,
            inPin,
            speed
        )
        basic.pause(2000)
        
    }
    /**
     * 音声合成で発話
     * @param s 発話させたい言葉, eg: "ohayo-."
     * @param pin 発話終了の端子, eg: P12
     * @param sw 発話終了の検出SW, eg: true:On, flase:Off
     */
    //% block="音声合成で発話 発話させたい言葉 %s 発話終了の検出端子 %pin 終了検出switch %sw"
    //% pin.defl=DigitalPin.P12
    //% sw.defl=true
    //% weight=90
    //% group="音声合成"
    export function 音声合成発話(s: string, pin: DigitalPin, sw: boolean) {
        // Microbit Device で動作中か
        const STR = 'zvgptuoieaZVGPTUOIEA'
        function isUpperCaseABC(c: string) {
            for (let i = 0; i < STR.length; i++) {
                if (c === STR[i]) {
                    return true
                }
            }
            return false
        }
        let swTalk = 0
        basic.pause(500)
        serial.writeLine(s + "\r")
        // device name
        let stg = control.deviceName().substr(0, 1)
        if (isUpperCaseABC(stg) === true && sw === true) {
            while (swTalk == 0) {
                swTalk = pins.digitalReadPin(pin)
            }
            swTalk = 0
        }
    }
    /**
     * 長いメロディー（端子13と14の0出力有り）
     * @param MyMero 組み込みメロディー, eg: "ピコーン"
     */
    //% block="長いメロディー %MyMero"
    //% weight=80
    //% group="音声合成"
    export function 長いメロディー(MyMero: Melodies) {
        //
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
        //
        let swMelody = 0
        music.onEvent(MusicEvent.MelodyEnded, function () {
            swMelody = 1
        })
        music.beginMelody(music.builtInMelody(MyMero), MelodyOptions.Once)
        while (swMelody == 0) {
            basic.pause(100)
        }
        swMelody = 0
    }
    /**
    * サーボ角度の初期化
    * @param s1 端子, eg: "P13"
    * @param s2 端子, eg: "P14"
    * @param xx s1の角度, eg: "xx"
    * @param yy s2の角度, eg: "yy"
    */
    //% block="サーボ初期化 s1 端子 %s1 角度 %xx s2 端子 %s2 角度 %yy"
    //% s1.defl=AnalogPin.P13
    //% s2.defl=AnalogPin.P14
    //% xx.defl=90
    //% yy.defl=90
    //% inlineInputMode=inline
    //% weight=70
    //% group="サーボモーター"
    export function サーボ変数設定(s1:AnalogPin, xx:number, s2:AnalogPin, yy:number) :void {
        __servo1 = s1;
        __servo2 = s2;
        __x = xx;
        __y = yy;
        pins.servoWritePin(__servo1, __x);
        pins.servoWritePin(__servo2, __y);
    }

    /**
    * サーボ移動
    */
    //% block="サーボ移動|端子 %s1 角度 %targetX 端子 %s2 角度 %targetY 一時停止(ミリ秒) %wait"
    //% s1.defl=AnalogPin.P13
    //% s2.defl=AnalogPin.P14
    //% wait.defl=10
    //% inlineInputMode=inline
    //% weight=68
    //% group="サーボモーター"
    export function サーボ移動(s1:AnalogPin, targetX: number, s2:AnalogPin, targetY: number, wait: number) {
        let d_x = Math.round(targetX - __x) // ターゲットまでの差分
        let d_y = Math.round(targetY - __y) // ターゲットまでの差分
        while ((d_x <= -2 || 2 <= d_x) || (d_y <= -2 || 2 <= d_y)) {
            basic.pause(wait)
            if (d_x <= -2 || 2 <= d_x) {
                __x = Math.round(__x + (d_x / 2))
                pins.servoWritePin(s1, __x)
                d_x = Math.round(targetX - __x)
            }
            if (d_y <= -2 || 2 <= d_y) {
                __y = Math.round(__y + (d_y / 2))
                pins.servoWritePin(s2, __y)
                d_y = Math.round(targetY - __y)
            }
            basic.pause(20)
        }
        __x = targetX
        __y = targetY
    }

    /**
     * サーボs1の値を返す
     */
    //% block="サーボ s1の値"
    //% weight=64
    //% group="サーボモーター"
    export function サーボs1の値() {
        return __x
    }
    //% block="サーボ s2の値"
    //% weight=63
    //% group="サーボモーター"
    export function サーボs2の値() {
        return __y
    }
    /**
     * 滑らかな角度の算出（sin値）
     * @param ana アナログ値, eg: "1023"
     * @param low 下限値, eg: "45"
     * @param high 上限値, eg: "135"
     */
    /**
    //% block="滑らかなの角度の算出 入力アナログ値 %ana 角度下限値 %low 角度上限値 %high"
    //% weight=62
    //% group="サーボモーター"
    export function 滑らかな角度(myAnalog: number, low: number, high: number) {
        let work: number = 0.0
        let ans: number = 0.0
        const p: number = 1024.0 / 2.0
        //
        work = Math.map(myAnalog, 0, 1023, 0, 180)
        work = Math.sin(work * Math.PI / 180) * 90
        if (myAnalog > p) {
            work = 90 + (90 - work)
        }
        ans = Math.floor(Math.map(work, 0, 180, low, high))
        //console.log("a=" + work + "--" + ans)
        return ans
    }
     */
    
    /**
     * キーパッド　入力された文字
     * @param _KeyStg 文字, eg: "A"
     */
    function キーパッド() :string {
        let _KeyStg: string = ""
        let _keyAnalog: number = 1023
        _keyAnalog = pins.analogReadPin(AnalogPin.P0)
        if (_keyAnalog < 46) {
            _KeyStg = "*"
        } else if (_keyAnalog < 131) {
            _KeyStg = "0"
        } else if (_keyAnalog < 203) {
            _KeyStg = "#"
        } else if (_keyAnalog < 278) {
            _KeyStg = "D"
        } else if (_keyAnalog < 342) {
            _KeyStg = "7"
        } else if (_keyAnalog < 385) {
            _KeyStg = "8"
        } else if (_keyAnalog < 432) {
            _KeyStg = "9"
        } else if (_keyAnalog < 463) {
            _KeyStg = "C"
        } else if (_keyAnalog < 500) {
            _KeyStg = "4"
        } else if (_keyAnalog < 527) {
            _KeyStg = "5"
        } else if (_keyAnalog < 550) {
            _KeyStg = "6"
        } else if (_keyAnalog < 575) {
            _KeyStg = "B"
        } else if (_keyAnalog < 599) {
            _KeyStg = "1"
        } else if (_keyAnalog < 610) {
            _KeyStg = "2"
        } else if (_keyAnalog < 625) {
            _KeyStg = "3"
        } else if (_keyAnalog < 650) {
            _KeyStg = "A"
        } else {
            _KeyStg = ""
        }
        if (_KeyStg != "") {
            return _KeyStg
        } else {
            return ""
        }
    }

    /**
     * キーパッド　入力された数値
     * @return _KeyNum 数値
     */
    //% block="入力された数値 %_KeyNum"
    //% weight=40
    //% group="キーパッド"
    export function 入力された数値() : number {
        const DELAY_TIME: number = 9000
        let _wkStg = ""
        let _getStg = ""
        let _maxTime = 0
        _maxTime = input.runningTime() + DELAY_TIME
        while(true) {
            _getStg = キーパッド()
            basic.pause(200)
            if(input.runningTime() > _maxTime) {
                _wkStg = ""
                break
            }
            if ( _getStg != "") {
                basic.showString(_getStg)
                if (_getStg == "#") {
                    break
                } else {
                    _wkStg = _wkStg + _getStg
                }
            } else {
                if(input.runningTime() > _maxTime) {
                    _wkStg = ""
                    break
                }
            }
        }
        if(_wkStg != "") {
            return parseFloat(_wkStg)
        } else {
            return -1
        }
    }

    /**
     * 文字ひとつ入力
     * @return _KeyStg 文字
     */
    //% block="文字ひとつ入力 %_KeyStg"
    //% weight=30
    //% group="キーパッド"
    export function 文字ひとつ入力() : string {
        const DELAY_TIME: number = 9000
        let _wkStg = "-1"
        let _getStg = ""
        let _maxTime = 0
        _maxTime = input.runningTime() + DELAY_TIME
        while(true) {
            _getStg = キーパッド()
            basic.pause(200)
            if(input.runningTime() > _maxTime) {
                break
            }
            if ( _getStg != "") {
                basic.showString(_getStg)
                _wkStg = _getStg
                break
            }
        }
        return _wkStg
    }

    /**
     * show a number
     * @param dat is number will be show, eg: 10
     */
    //% block="数字表示max99 %dat"
    //% dat.min=0 dat.max=99
    //% weight=10
    //% group="キーパッド"
    export function 数字表示max99(dat: number): void {
        if(dat<0)
            dat=0;

        if(dat < 10) {
            basic.showNumber(dat);
        } else {
            let a = FONT[Math.idiv(dat, 10) % 10];
            let b = FONT[dat % 10];

            for (let i = 0; i < 5; i++) {
                img.setPixel(0, i, 1 == a[i * 2])
                img.setPixel(1, i, 1 == a[i * 2 + 1])
                img.setPixel(3, i, 1 == b[i * 2])
                img.setPixel(4, i, 1 == b[i * 2 + 1])
            }
            img.showImage(0, 10);
        }

    }
}
