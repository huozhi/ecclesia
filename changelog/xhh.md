#change log

---
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