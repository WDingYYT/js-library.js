//阻止鼠标右键默认事件
function clearContexTmenu()
{
	document.oncontextmenu=function()
	{
		return false;
	}
}

//设置cookie
function setCookie(name,value,iDay)
{
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+iDay);

	document.cookie=name+'='+value+';expires='+oDate;
}


//阻止键盘默认事件（只识别数字和删除）
function distinguishNum(obj)
{
	obj.onkeydown=function(ev)
	{
		var oEvent=ev||event;

		if(oEvent.keyCode!=8 && (oEvent.keyCode<48 || oEvent.keyCode>57))
		{
			return false;
		}
	}
}

//js事件绑定
function eventBinding(obj,eventName,fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+eventName,fn);
	}else
	{
		obj.addEventListener(eventName,fn,false);
	}
}

//获取某一父节点下有相同Class的子节点
function getByClass(oParent,sClass) // oParent：父节点   sClass：需要选择的Class
{
	var aResult=[]; //返回的元素数组
	var aEle=oParent.getElementsByTagName('*'); // 获取父节点下的所有子节点

	for(var i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass) // 判断子节点是否有sClass
		{
			aResult.push(aEle[i]);    // 将有sClass的元素装入数组
		}
	}

	return aResult;					  // 将数组返回
}

//获取元素的主体的属性（写在css中的宽，高等）
function getStyle(obj,attr)
{
	if(obj.currentStyle)			//判断是否是IE，有currentStyle方法。否则调用getComputedStyle方法
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj,false)[attr];
	}
}

//获取鼠标位置
function getPos(ev)
{
	var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
	var scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;

	return {x:ev.clientX+scrollLeft,y:ev.clientY+scrollTop};
}

//基础多物体运动框架
function startMove(obj,json,fnEnd)	//obj需要操作的元素  attr需要操作的属性名  														iTarget运动的范围	fnEnd结束时运行的函数
{
	clearInterval(obj.timer);	
	obj.timer=setInterval(function(){
		var bStop=true;

		for(var attr in json)
		{
			var cur=0;				//获取需要操作的属性的值
			if(attr=="opacity")
			{
				cur=Math.round(parseFloat(getStyle(obj,attr))*100);
			}
			else
			{
				cur=parseInt(getStyle(obj,attr));	
			}

			var speed=(json[attr]-cur)/6;				//计算速率
			speed=speed>0?Math.ceil(speed):Math.floor(speed);

			if(cur!=json[attr])bStop=false;

			if(attr=="opacity")
			{
				obj.style.filter='alpha(opcity:'+(cur+speed)+')'; //兼容ie
				obj.style.opacity=(cur+speed)/100;
			}
			else
			{
				obj.style[attr]=cur+speed+'px';
			}
		}

		if(bStop)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd();
		}
	},30);
}

//元素跟随鼠标移动
function followMouseMove(obj,oEvent)
{
	var pos=getPos(oEvent);

	for (var i = obj.length-1; i > 0; i--) {
		obj[i].style.left=obj[i-1].offsetLeft+'px';
		obj[i].style.top=obj[i-1].offsetTop+'px';
	}
	obj[0].style.left=pos.x+'px';
	obj[0].style.top=pos.y+'px';
}

//简易鼠标拖拽
function mouseDrag(obj)
{
	var disX=0;
	var disY=0;
	
	obj.onmousedown=function(ev)
	{
		var oEvent=ev||event;

		disX=oEvent.clientX-obj.offsetLeft;
		disY=oEvent.clientY-obj.offsetTop;

		document.onmousemove =function(ev)
		{
			var oEvent=ev||event;
			var l=oEvent.clientX-disX;
			var t=oEvent.clientY-disY;

			if(l<0)
			{
				l=0;
			}
			else if(l>document.documentElement.clientWidth-obj.offsetWidth)
			{
				l=document.documentElement.clientWidth-obj.offsetWidth;
			}

			if(t<0)
			{
				t=0;
			}
			else if(t>document.documentElement.clientHeight-obj.offsetHeight)
			{
				t=document.documentElement.clientHeight-obj.offsetHeight;
			}

			obj.style.left=l+'px';
			obj.style.top=t+'px';
		}

		document.onmouseup =function()
		{
			document.onmousemove = null;
			document.onmouseup = null;

			if(obj.releaseCapture())
			{
				obj.releaseCapture();  //事件释放，将所有的事件释放
			}
		}

		if(obj.setCapture())
		{
			obj.setCapture();  //事件捕获，将页面触发的所有事件集中到obj上触发(兼容ie低版本)
		}
		else
		{
			return false;
		}
	}
}

//Ajax封装
//方法-process： GET POST
//连接-url： 目标URL
//成功执行函数-fnSucc
//失败执行函数-fnFaild
function ajax(process,url,fnSucc,fnFaild)
{
	//创建Ajax对象
	if(window.XMLHttpRequest)
	{
		var oAjax=new XMLHttpRequest();
	}
	else
	{
		var oAjax=new ActiveXObject("microsoft.XMLHTTP"); //IE6
	}
 	
 	//连接服务器
 	//open(方法，连接，异步传输)
 	//异步传输： true false
 	oAjax.poen(process,url,true);

 	//发送请求
 	oAjax.send();

 	//接受请求
 	//readyStatde 值表达的状态
 	//0 （未初始化）还没有调用open()方法
 	//1	（载入）已调用send()方法，正在发送请求
 	//2 （载入完成）send()方法完成，已收到全部响应内容
 	//3 （解析）正在解析响应内容
 	//4 （完成）响应内容解析完成，可以在客户端调用了
 	oAjax.onreadystatechange=function()
 	{
 		if(oAjax.readyStatde==4) //读取完成
 		{
 			if(oAjax.status==200) //成功
 			{
				fnSucc(oAjax.responseText);
 			}
 			else //失败
 			{
				if(fnFaild)
				{
					fnFaild(oAjax.status);
				}
 			}
 		}
 	}
}

//面向对象利用空对象作为中介继承封装
//Child 继承对象
//Parent 被继承对象
function extend(Child, Parent) 
{
　　var F = function(){};
　　F.prototype = Parent.prototype;
　　Child.prototype = new F();
　　Child.prototype.constructor = Child;
　　Child.uber = Parent.prototype;
}

//面向对象拷贝继承封装
//Child 继承对象
//Parent 被继承对象
function extend2 (Child, Parent) 
{
　　var p = Parent.prototype;
　　var c = Child.prototype;
　　for (var i in p)
	{
　　　　c[i] = p[i];
　　}
　　c.uber = p;
}