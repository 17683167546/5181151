/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象
 * {time:开始时间，words:歌词内容}
 */
function parseLrc(){
     let lines = lrc.split('\n')
     let result = []
    for (let i = 0; i < lines.length; i++) {
         let str = lines[i]
         let parts = str.split(']')
         let timeStr = parts[0].substring(1)
         let obj = {
            time: parseTime(timeStr),
            words: parts[1],
        }
        result.push(obj)
    }
    return result
}

/**
 * 将一个时间字符串解析为数字(秒)
 * @param {string} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr) {
    let parts = timeStr.split(':')
    return +parts[0] * 60 + +parts[1]
}

let lrcData = parseLrc()

//获取需要的dom
let doms ={
    audio: document.querySelector('audio'),
    ul:document.querySelector('.container ul'),
    container:document.querySelector('.container')
}

/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数字中，应该显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 */
function findIndex(){
    //播放器当前时间
    let curTime = doms.audio.currentTime
    for (let i = 0; i < lrcData.length; i++) {
        if(curTime < lrcData[i].time){
            return i - 1
        }
    }
    return lrcData.length - 1
}

//界面

/**
 * 创建歌词元素 li
 */
function createLrcElements(){
    for (let i = 0; i < lrcData.length; i++) {
        let li = document.createElement('li')
        li.textContent = lrcData[i].words
        doms.ul.appendChild(li)//改动dom树
    }
}

// //优化版，防止li创建过多
// function createLrcElements(){
//     let frag = document.createDocumentFragment()
//     //文档片段
//     for (let i = 0; i < lrcData.length; i++) {
//         let li = document.createElement('li')
//         li.textContent = lrcData[i].words
//         frag.appendChild(li)
//     }
//     doms.ul.appendChild(frag)
// }

createLrcElements()

//容器高度
let containerHeight = doms.container.clientHeight
//每个li的高度
let liHeight = doms.ul.children[0].clientHeight
//最大变量
let maxoffset = doms.ul.clientHeight

/**
 * 设置 ul 元素偏移量
 */
function setOffset(){
    let index = findIndex()
    let offset = liHeight * index + liHeight / 2 
    offset  < 0 ? offset = 0: offset 
    offset > maxoffset ? offset = maxoffset: offset   
    doms.ul.style.transform = `translateY(${225 - offset}px)`
    let li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }
     li = doms.ul.children[index]
    if(li){
        li.classList.add('active')
    }
}

//获取播放器时间事件，调用函数setOffset
doms.audio.addEventListener('timeupdate', setOffset)