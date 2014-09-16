#change log

---

9/16

将MdTemp 中的数据存入Meetings中时 会删除相应作者上传的所有数据

***
9/15

加压缩解压

`/history-detail` : compress response data
                    {response : "query-detail-success", img : result}

`/upload-img` : uncompress request data

`/query-img` : compress  response data

***
9/10

register & login 目前可用

但只有 成功/失败 两个状态 无详细信息
***
9/10

修复了loginCheck 的bug, 所有User对象请用以下格式

	var user = {
    username: "",
    userPwd: "",
    conferences:[]
    }

***
9/9

将master分支合并过来