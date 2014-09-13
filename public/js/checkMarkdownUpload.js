/*JS前端检测上传文件类型以*/
var FileObj,FileExt,ErrMsg,FileMsg,HasCheked;//全局变量 图片相关属性
//以下为限制变量
var AllowExt = ".md|.markdown|.txt|";
HasChecked = false;
 //显示提示信息 tf=true 显示文件信息 tf=false 显示错误信息 msg-信息内容
function ShowMsg(msg,tf) {
  if(!tf) {
      document.all.UploadButton.disabled=true;
      FileObj.outerHTML = FileObj.outerHTML;
      MsgList.innerHTML = msg;
      HasChecked = false;
  } else {
      document.all.UploadButton.disabled = false;
      MsgList.innerHTML = msg;
      HasChecked = true;
  }
}

function CheckExt(obj) {
  ErrMsg = "";
  FileMsg = "";
  FileObj = obj;
  HasChecked = false;
  if (obj.value == "") return false;
  MsgList.innerHTML = "  Waitting...";
  document.all.UploadButton.disabled = true;
  FileExt = obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();

  //判断文件类型是否允许上传 
  if(AllowExt!=0 && AllowExt.indexOf(FileExt+"|")==-1) {
      ErrMsg = "  The document type does not allow uploads. Please upload "
        + AllowExt + " type of file, the current file type is"+FileExt;
      ShowMsg(ErrMsg,false);
      return false;
  }
  FileMsg = "  File Extension is " + FileExt;
  ShowMsg(FileMsg,true);
}