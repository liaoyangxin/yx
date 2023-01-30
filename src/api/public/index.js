// 00:00:00 转毫秒
export function timeToSec(time) {
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]
    let s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s * 1000
}
// 00:00:00 转秒
export function timeToSeconds(time) {
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]
    let s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s
}
// 毫秒转 00:00:00
export function secToTime(value) {
    const s = parseInt(value)
    let t = ''
    if (s>1) {
        let hour = Math.floor(s/3600)
        let min = Math.floor(s/60) % 60
        let sec = s/60
        t = hour < 10 ? '0' + hour + ':' :  hour + ':'
        t += min < 10 ? '0' + min + ':' :  min + ':'
        t += sec < 10 ? '0' + sec.toFixed(2) : sec.toFixed(2)
    }
    return t
}
// 秒转 00:00:00
export function secondsToTime(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
 
    let res = '';
    res += `${h}:`;
    res += `${m}:`;
    res += `${s}`;
    return res;
}

export function leftBoxHeight() {
    
}