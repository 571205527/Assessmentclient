import { app, BrowserWindow,Menu,Tray,shell,screen,ipcMain,dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios;

var version =require('../../package.json').version

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null
  
//单例
// const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
//   // Someone tried to run a second instance, we should focus our window.
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) mainWindow.restore()
//     mainWindow.focus()
//   }
// })

// if (isSecondInstance) {
//   app.quit()
// }

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height:600,
    width: 800,
    title:'筑桥实验小学',
    useContentSize: true,   
    maximizable:false,//最大化 
    resizable:false,// Boolean - 是否可以改变窗口size，默认为 true
    show:false,//创建时是否显示
    frame:false,//无框窗口
    webPreferences: {webSecurity: false},
    transparent: true,//使窗口 透明
  })
  Menu.setApplicationMenu(null);//去掉菜单
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.once('ready-to-show', () => {//页面加载完后再出现窗口
    // mainWindow.maximize();
    // mainWindow.setFullScreen(true);
    mainWindow.show()
    
  })
 
// 打开开发工具页面
//mainWindow.webContents.openDevTools();
}

// var fs = require('fs');
// var request = require('request');
// //var unzip = require('unzip');
// var zlib = require('zlib');
// var gzip = zlib.gunzip()
// /*
// * uri 网络文件地址
// * filename 文件名
// * callback 回调函数
// */
// function downloadFile(uri,filename,callback){
//     var stream = fs.createWriteStream(filename);
//     request(uri).pipe(stream).on('close', callback);
// }

//检查更新
function updateHandle() {
  // if(process.env.NODE_ENV === 'development'){
  //   return
  // } 
  autoUpdater.autoDownload = false
  let message = {
    error: 'error',
    checking: 'checking',//正在检查更新……
    updateAva: 'updateAva',//发现新版本
    updateNotAva: 'updateNotAva',//已是最新版本
  }; 
  const uploadUrl = "http://118.25.65.152/usr/src/8087"; // 下载地址，不加后面的**.exe
  //const uploadUrl = "http://henkel.cn-bj.ufileos.com";
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function (info) {
    sendUpdateMessage(message.checking)
    console.log(info)
  }); 

  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
    var newVersion = info.version.split('.')[0]
        version = version.split('.')[0]
    if(newVersion-version == 0){
      var msg = '发现新版本'+info.version+'，是否立即下载？';
      const dialogOpt0 ={
        type:'info', 
        buttons:['确定','取消'],
        title:'版本更新',
        detail:msg,
        cancelId:1
      }
      dialog.showMessageBox(mainWindow,dialogOpt0, (response) => {
        if (response === 0){
          //const {shell} = require('electron');
          // 打开链接
          //shell.openExternal('http://118.25.65.152/usr/src/8087/unpack.zip');
          //autoUpdater.downloadUpdate()
          //const { app } = require ('electron');
          let execPath;
          //execPath = path.dirname (app.getPath ('exe')); 
          execPath = path.dirname (process.execPath);
          //console.log("path:"+execPath)

          var _path = 'http://118.25.65.152/usr/src/8087/unpack.zip';
          var path1 = "d://usr//facts.zip";
          var out = "d://usr//facts//";
          // downloadFile(_path,path1,function(){
          //   console.log(path1+'下载完毕');
            
          //   //解压文件
          //   var inp = fs.createReadStream(path1);
          //   inp.pipe(gzip).pipe(fs.createWriteStream(out));
          //   // var gzip = zlib.gunzipSync();
          //   // var inp = fs.createReadStream(path1);
          //   // var outFile = fs.createWriteStream(out);
          //   // inp.pipe(gzip).pipe(outFile);
          // });


          // request(_path)
          //   .pipe(fs.createWriteStream('facts.zip'))
          //   .on('close', function () {
          //     console.log('File written!');
          //   });
          // var http = require('http')
          // http.get(_path, function (response) {
          //   response.setEncoding('binary');//二进制binary
          //   var Data = '';
          //   response.on('data', function (data) {//加载到内存
          //     Data += data;
          //   }).on('end', function () {//加载完
          //     console.log(Data.length)
          //     fs.writeFile(path1, Data , function () {
          //       console.log('ok')
          //     });
          //   })
          // })
        }
      }) 
    }
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  }); 
  //更新下载进度事件
  autoUpdater.on('download-progress',function(progressObj){
    mainWindow.webContents.send('downloadProgress',progressObj);
  })

  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    const dialogOpt1 = {
      type: 'info',
      buttons: ['稍后', '重新启动'],
      title: '版本更新',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: '新版本已被下载。重新启动应用程序以应用更新。'
    }
    dialog.showMessageBox(dialogOpt1, (response) => {
      if (response === 1)autoUpdater.quitAndInstall()
    })
  });   
 
  ipcMain.on("checkForUpdate",()=>{
      //执行自动更新检查
      autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}

//托盘图标
var tray = null;
app.on('ready', ()=>{
  updateHandle();
  createWindow();
  var trayPath = process.env.NODE_ENV === 'development'?path.join(__dirname,'../../static/img/16x16.ico'):`${global.__static}/img/16x16.ico`
  tray = new Tray(trayPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '筑桥小学',
      role:'about',
      click: function () {
        shell.openExternal('http://www.thelittlebridge.cn/')
        }
    },
    {
      label: '关闭',
      role: 'close',
      click:function(){
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.setToolTip('筑桥实验小学');

  tray.on('click',function(){
    mainWindow.show();
    if( mainWindow.getChildWindows()[0] ){
      mainWindow.getChildWindows()[0].hide();
    }
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
 
export default mainWindow
