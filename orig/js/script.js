<!--
// 플레시파일에서 링크걸때에는
// javascript:go_site(1);
// 이런식으로 링크걸면 됩니다.
// 번호는 url_list[번호]값을 넣으면 됩니다.
// ?clickmenu=1
// 2009년 04월 28일 이후부터는 일반페이지 링크는 <a href="<?=go_site(1);?>">  이런식으로 걸어야 됩니다.


//##############################   페이지 정의   ###############################
//
// 2009년 04월 28일 이후 삭제
//
//
//############################   페이지 정의   ###############################





if(typeof(SiteUrl) == 'undefined') SiteUrl = 'http://' + location.host;




//###########  드림위버용 함수 ############
function MM_preloadImages() 
{ //v3.0
  var d=document; 
  if(d.images)
  { 
    if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; 
    for(i=0; i<a.length; i++)
    {
      if (a[i].indexOf("#")!=0)
      { 
        d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];
      }
    }  
  }  
}
    
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}    
//###########  드림위버용 함수 ############


//아이프레임 조절 함수


function iframeResize(ifrm) 
{ 
  ifrm.setAttribute("height", eval(ifrm.name).document.body.scrollHeight); 
} 


var ie_yn = 'N';
if(window.navigator.appName.indexOf("Explorer") !=-1)
{
  ie_yn = 'Y';
}


var old_height = 0;

function resize_iframe(ifname)
{

  try
  {
    var agentName = navigator.userAgent; 
    var tmpHeight = document.getElementById(ifname).offsetTop; 
    if((agentName.indexOf("MSIE") > -1 && agentName.indexOf("Windows") > -1) || agentName.indexOf("Trident") > -1)     
    { 
      tmpHeight = document.getElementById(ifname).offsetHeight - document.getElementById(ifname).clientHeight;
    }
    else if( agentName.indexOf("Firefox") > -1  ) 
    {
      tmpHeight = tmpHeight; 
    }  
    else if(  agentName.indexOf("Chrome") > -1  ) 
    {
      tmpHeight = document.getElementById(ifname).offsetHeight - document.getElementById(ifname).clientHeight;

    }  
    else if(agentName.indexOf("Mac") > -1) 
    { 
      tmpHeight = document.getElementById(ifname).offsetHeight - document.getElementById(ifname).clientHeight;
    } 
    else if(agentName.indexOf("Opera") > -1) 
    { 
      tmpHeight = tmpHeight; 
    } 
    else if(agentName.indexOf("Safari") > -1) 
    {
      tmpHeight = document.getElementById(ifname).offsetHeight - document.getElementById(ifname).clientHeight;
    }    
    else
    {
      tmpHeight = document.getElementById(ifname).offsetHeight - document.getElementById(ifname).clientHeight;
     }  

    var newHeight = document.getElementById(ifname).contentWindow.document.body.scrollHeight + tmpHeight;
    if( (newHeight > old_height) && (newHeight - old_height < 30 )) 
    {
      newHeight = old_height;
    }
    document.getElementById(ifname).style.height = newHeight + 'px'; 
    old_height = newHeight;    
  }
  catch(e)
  {
  }
}

function reload_iframe(ifname)
{

  resize_iframe(ifname);
  setTimeout("reload_iframe('" + ifname + "');",1000);

}


var isDOM = (document.getElementById ? true : false);
var isIE4 = ((document.all && !isDOM) ? true : false);
var isNS4 = (document.layers ? true : false);
var isNS = navigator.appName == "Netscape";

function getRef(id) {
	if (isDOM) return document.getElementById(id);
	if (isIE4) return document.all[id];
	if (isNS4) return document.layers[id];
}

function getSty(id) {
	x = getRef(id);
	return (isNS4 ? getRef(id) : getRef(id).style);
}

var scrollerHeight = 88;
var puaseBetweenImages = 3000;
var imageIdx = 0;
var top_height = 0;


function moveRightEdge(div_id, top_height) {
	var yMenuFrom, yMenuTo, yOffset, timeoutNextCheck;
  top_height = eval(top_height);
	if (isNS4) {
   	var div_obj = document[div_id];
		yMenuFrom   = div_obj.top;
		yMenuTo     = windows.pageYOffset + top_height;   // 위쪽 위치
	} else if (isDOM) {
  	var div_obj = getRef(div_id);
		yMenuFrom   = parseInt (div_obj.style.top, 10);
		if(document.documentElement.scrollTop > document.body.scrollTop)
		{
  		yMenuTo     = document.documentElement.scrollTop + top_height; // 위쪽 위치
		}
		else
		{
  		yMenuTo     = (isNS ? window.pageYOffset : document.body.scrollTop) + top_height; // 위쪽 위치
		}
	}
	timeoutNextCheck = 253;

	if (yMenuFrom != yMenuTo) {
		yOffset = Math.ceil(Math.abs(yMenuTo - yMenuFrom) / 20);
		if (yMenuTo < yMenuFrom)
			yOffset = -yOffset;
		if (isNS4)
			div_obj.top += yOffset;
		else if (isDOM)
			div_obj.style.top = parseInt (div_obj.style.top, 10) + yOffset;
			timeoutNextCheck = 10;
	}
	setTimeout ("moveRightEdge('"+div_id+"', '"+top_height+"')", timeoutNextCheck);
}



function go_site(num)
{
  self.status = num;
  if(url_list[num])
  {

// 본창으로 이동하는 경우
    if(newwin_list[num] != 'true' && fullwin_list[num] != 'true' && (window_list[num] == '' || window_list[num] == null))
    {
    	location=url_list[num];
    }

// 윈도우 창으로 열리는경우
    if(window_list[num] != '' && window_list[num] != null)
    {
      window.open(url_list[num], 'new_win', window_list[num]);
    }


// 전체창으로 열리는 경우
    if(fullwin_list[num] == 'true')
    {
      window.open(url_list[num], 'new_win', 'width=1024 height=724 resizable=yes');
    }


// 새창으로 열리는경우
    if(newwin_list[num] == 'true')
    {
      window.open(url_list[num], '_blank', 'directories=yes, titlebar=yes, toolbar=yes, menubar=yes, statusbar=yes, scrollbars=yes, resizable=yes, location=yes, status=yes');
    }
  }
}


//플래쉬파일 보여주는 함수
var flash_width;
var flash_height;
function flash_print(flash_filename, flash_width, flash_height)
{
  if(flash_width != '') var width_str = 'width=' + flash_width;
  if(flash_height != '') var height_str = 'height=' + flash_height ;
	var sTag = ''
		+ '<object classid=\'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\' codebase=\'http://active.macromedia.com/flash4/cabs/swflash.cab#version=4,0,0,0\' ' + width_str + ' ' + height_str + '>'
		+ '        <param name=\'movie\' value=\'' + flash_filename + '\'>'
		+ '        <param name=\'play\' value=\'true\'>'
		+ '        <param name=\'loop\' value=\'true\'>'
	  + '        <param name=\'wmode\' value=\'Transparent\'>'
		+ '        <param name=\'quality\' value=\'high\'>'
		+ '        <param name=\'allowScriptAccess\' value=\'always\' />'		
		+ '        <param name=\'flashvars\' value=\'SiteUrl=' +SiteUrl + '\'>'						
		+ '        <embed src=\'' + flash_filename + '\' play=\'true\' loop=\'true\' wmode=\'Transparent\' allowScriptAccess=\'always\'  quality=\'high\' pluginspage=\'http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash\' ' + width_str + ' ' + height_str + '></embed></object>'
		+ '';
	document.write (sTag);
}


function view_movie(filename, m_width, m_height){
  if(m_width != '') var width_str = ' width="' + m_width + '" ';
  if(m_height != '') var height_str = ' height= "' + m_height + '" ' ;
	var sTag = ''
		+ '<object id="MediaPlayer1" ' + width_str + height_str +'  classid="CLSID:22D6f312-B0F6-11D0-94AB-0080C74C7E95" standby="Loading Microsoft?Windows?Media Player components..." type="application/x-oleobject">'
		+ '                                            <param name="transparentAtStart" value="True">'
		+ '                                            <param name="transparentAtStop" value="True">'
		+ '                                            <param name="AnimationAtStart" value="False">'
		+ '                                            <param name="AutoStart" value="true">'
		+ '                                            <param name="AutoRewind" value="true">'
		+ '                                            <param name="DisplaySize" value="0">'
		+ '                                            <param name="AutoSize" value="false">'
		+ '                                            <param name="ShowDisplay" value="false">'
		+ '                                            <param name="ShowStatusBar" value="false">'
		+ '                                            <param name="ShowControls" value="true">'
		+ '                                            <param name="EnableContextMenu" value="False">'
		+ '                                            <param name="FileName" value="' + filename + '">'
		+ '                                            <param name="Volume" value="0">'
		+ '                                            <embed type="application/x-mplayer2" pluginspage = "http://www.microsoft.com/Windows/Downloads/Contents/Products/MediaPlayer/" src="' + filename + '" name="MediaPlayer1" width="300" height="222" displaysize="0" showcontrols="false"'
		+ 'autostart="true" transparentatstart="True" transparentatstop="True" animationatstart="False" autorewind="true" autosize="false" showdisplay="false" showstatusbar="true" enablecontextmenu="False" volume="0"> </embed>'
		+ '                                    </object>'
		+ '';
	document.write (sTag);
}



function view_movie2(filename){
	var sTag = ''
		+ '<object id="MediaPlayer1" width="290" height="190"  classid="CLSID:22D6f312-B0F6-11D0-94AB-0080C74C7E95" standby="Loading Microsoft?Windows?Media Player components..." type="application/x-oleobject">'
		+ '                                            <param name="transparentAtStart" value="True">'
		+ '                                            <param name="transparentAtStop" value="True">'
		+ '                                            <param name="AnimationAtStart" value="False">'
		+ '                                            <param name="AutoStart" value="true">'
		+ '                                            <param name="AutoRewind" value="true">'
		+ '											   <param name="Loop" value="true">'
		+ '                                            <param name="DisplaySize" value="0">'
		+ '                                            <param name="AutoSize" value="false">'
		+ '                                            <param name="ShowDisplay" value="false">'
		+ '                                            <param name="ShowStatusBar" value="false">'
		+ '                                            <param name="ShowControls" value="false">'
		+ '                                            <param name="EnableContextMenu" value="False">'
		+ '                                            <param name="FileName" value="' + filename + '">'
		+ '                                            <param name="Volume" value="0">'
		+ '                                            <embed type="application/x-mplayer2" pluginspage = "http://www.microsoft.com/Windows/Downloads/Contents/Products/MediaPlayer/" src="' + filename + '" name="MediaPlayer1" width="300" height="222" displaysize="0" showcontrols="false"'
		+ 'autostart="true" transparentatstart="True" transparentatstop="True" animationatstart="False" autorewind="true" autosize="false" loop="true" showdisplay="false" showstatusbar="true" enablecontextmenu="False" volume="0"> </embed>'
		+ '                                    </object>'
		+ '';
	document.write (sTag);
}
//북마크 추가
function add_bookmark()
{
   if(window.external && ('AddFavorite' in window.external)) 
   {
     window.external.AddFavorite(SiteUrl, '');
   }
   else
   {
      alert('크롬 브라우저에서는 Ctrl+D버튼을 입력하시면 즐겨찾기를 추가하실수 있습니다.');
   }
}


function _OBJ(id)
{
  return document.getElementById(id);
}

function $E(id)
{
  return document.getElementById(id);
}

function $P(id)
{
  return parent.document.getElementById(id);
}

function read_partner_info(P_id)
{
    var url = SiteUrl + "/lib/ajax_read_partner_info.php?P_id=" + P_id;
    new Ajax.Request
    ( 
      url, 
      { 
          contentType: "text/xml;charset=euc-kr",
          method:    "get", 
          onComplete: print_partner_info.bind(this, "read_partner")
      }
    );   
}

function print_partner_info(out_id, result)
{
  output_id = document.getElementById(out_id);
  result_str =  result.responseText;
	output_id.innerHTML = result_str;  
}

// jqeury ajax방식으로 변경

function ajax_read_session()
{
    var url = SiteUrl + "/lib/ajax_session.php";
    $.ajax({      
        url:url
        }); 
  ajax_live_session();        
}

function  ajax_live_session()
{
  setTimeout("ajax_read_session()", 30000);
}



/*


//Prototype style

function add_opt(opt_type)
{
    cost_name = "C_opt_name_" + opt_type;
    cost_name_value = document.getElementById(cost_name).value;

    cost_name_e = "C_opt_name_e_" + opt_type;    
    cost_name_e_value = document.getElementById(cost_name_e).value;    

    opt_cost = "C_opt_cost_" + opt_type;    
    opt_cost_value = document.getElementById(opt_cost).value;    


    var url = "ajax_option_cost.php";
    new Ajax.Request
    ( 
      url, 
      { 
          method:    "get", 
          encoding: "UTF-8",
          parameters: {
               mode: 'add', 
               item_idx: '<?=$C_index?>',
               temp_idx: '<?=$temp_idx?>',
               opt_type: opt_type,
               cost_name: cost_name_value,               
               cost_name_e: cost_name_e_value,
               opt_cost: opt_cost_value
          },
          onComplete: print_add_opt.bind(this, opt_type)
      }
    ); 
}  
function print_add_opt(opt_type, result)
{
  result_str =  result.responseText;
  if(result_str == 'OK') 
  {
    read_opt(opt_type);
  }  
  else
  {
    alert(result_str);
  }


}  



//Jquery style
function check_id()
{
 user_id = document.getElementById('A_id').value;
 
  $.ajax({
            url:'ajax_check_id.php',
            type:'post',            
            data : {
               "user_id" : user_id, 
               "mode" : "checked"
            },
            
            success:function(data)
            {
               ret_ck_msg(data);
            }
        });

}

function ret_ck_msg(data)
{

  output_id = document.getElementById('id_ck');
  if(data == 'true')
  {
    output_id.innerHTML = "<font color='blue'>사용가능 아이디입니다.</font>";
    document.getElementById('id_checked').value = true;
  }
  else
  {
    output_id.innerHTML = data;
  }    
}  

// 버튼 클릭시 ajax 실행  
$("#btnOK").click(function(){  
      
    var url="test.aspx";  
    var params="param1="+param1+"¶m2="+param1;  
  
    $.ajax({      
        type:"POST",  
        url:url,      
        data:params,      
        success:function(args){   
            $("#result").html(args);      
        },   
        beforeSend:showRequest,  
        error:function(e){  
            alert(e.responseText);  
        }  
    });  
      
});
*/



//함수실행을 페이지로딩후에 실행
function load_function(f_name, f_var1, f_var2, f_var3, f_var4, f_var5)
{
  out_func = f_name + "('" + f_var1 + "', '" + f_var2 + "', '" + f_var3 + "', '" + f_var4 + "', '" + f_var5 + "' );";
  setTimeout(out_func, 0);
}


//따라다니는 레이어
  function scroll_layer(div_id, top_height)
  {
    if (isNS4)
    {
    	var divMenu = document[div_id];
    	divMenu.top = top.pageYOffset + top_height;
    	divMenu.visibility = 'visible';
    	moveRightEdge(div_id, top_height);
    } else if (isDOM)
    {
  	var divMenu = getRef(div_id);
  	divMenu.style.top = (isNS ? window.pageYOffset : document.body.scrollTop) + top_height;
    if(ie_yn == 'N')
    {
      divMenu.style.left = 0;
      ff_top = 0;
    }
  	divMenu.style.visibility = 'visible';
  	moveRightEdge(div_id, top_height);
  	}
  }

function checkJumin(str)
{
  var jumin  = /^[0-9]{6}-?[0-9]{7}$/;
  var number = /^[0-9]*$/;

  var len  = str.length;
  var a    = "";
  var tmp  = "";
  var tmp2 = "";
  for(i=0; i<len; i++) {
    a = str.substring(i,i+1);
    if ( !number.test(a) ) continue;

    tmp = str.substring(i,i+14);
    tmp2 = str.substring(i,i+13);
    if ( jumin.test(tmp) || jumin.test(tmp2) )
    {
      return 0;
    }
    else
    {
      return 1;
    }
  }
}


//숫자에 ,빼기
function c_format(input_number)
{
  var number = "";
  number = input_number + "";
  number_str = "";
  zero_ck = true;
  for(i_02 = 0 ; i_02 < number.length ; i_02++)
  {
    cpoint = i_02;
    this_number = number.substring(cpoint,cpoint+1);
    if(this_number != 0) 
    {
      zero_ck = false;
    }  
    
    if(this_number == '-' || this_number == '0'  || this_number == '1' || this_number == '2'   || this_number == '3'   || this_number == '4'   || this_number == '5'   || this_number == '6'   || this_number == '7'   || this_number == '8'   || this_number == '9')
    {
       if(zero_ck == true)
       {
         number_str = number_str + '';
       }
       else
       {
        number_str = number_str + this_number;
       } 
    }
  }
  return number_str;
}



function rand_num(min_num, max_num)
{
  min_num= min_num*1;
  max_num= max_num*1;  
  div_num = max_num - min_num + 1;
  if(div_num > 0)
  {
    r_num = min_num + (Math.ceil((Math.random() * 1000000000000000)) % div_num); 
  }
  else
  {
   r_num = 0;
  }  
  return r_num;
}



//마우스 오버하면 이미지 바뀜
function change_img(img_name,img_src) 
{
  document[img_name].src=img_src;
}

//숫자,붙이기
function n_format(input_number)
{
   m_ck = false;
   //음수처리
  abs_input_number = Math.abs(input_number);
  
  if(abs_input_number != input_number)
  {
    input_number = abs_input_number;
    m_ck = true;
  } 
   
  //,없앤 숫자
  input_number = new String(input_number)
  input_number_1 = new String();
  input_number_2 = new String();



  //소수점처리
  c_pos = input_number.indexOf(".");
  if(c_pos > 0)
  {
   input_number_1 = input_number.substring(0, c_pos);
   input_number_2 = input_number.substring(c_pos + 1, input_number.length);   
   input_number = input_number_1;
  }

  input_number = c_format(input_number);
  number = input_number;
  number_str = "";
  for(i_01 = 0 ; i_01 < number.length ; i_01++)
  {
    cpoint = i_01;
    this_number = number.substring(cpoint,cpoint+1);
    if((number.length - i_01) % 3 == 1 && i_01 != number.length -1)
    {
     this_number = this_number + ',';
    }
    number_str = number_str + this_number;
  }
  if(number_str == '') number_str = 0;
  if(input_number_2 != '')
  {
    number_str = number_str + "." + input_number_2;
  } 
  if(m_ck == true)  
  {
    number_str = "-" + number_str;
  }
  return number_str;

}



// 숫자->,붙은 숫자로 변환, 2초간 수치가 올라 애니매이션 효과, 원래, 붙은 숫자는 그대로, -값은 -값대로 적용됨
function number_format_ani(vnum_id)
{
  this.num_id = vnum_id;
  this.max_value = 0;  
  this.ani_time = 2;
  this.now_num = 0;      
  this.start_time = 0;
  this.gap_time = 0;

  this.ini = function() 
  {
    this.max_value = Number(this.c_format(document.getElementById(this.num_id).innerText)); 
    this.gap_time = this.max_value / (this.ani_time*1000);    
    this.start_time = Date.now();
    window.setTimeout(this.ck_time_ani.bind(this), 100);  
  };
  
  this.ck_time_ani = function() 
  {
    this_time = Date.now() - this.start_time;
    if(this.max_value >= 0)
    {
      this.now_num = Math.floor(this.gap_time*this_time);
      if(this.now_num < this.max_value)
      {
        document.getElementById(this.num_id).innerHTML = this.n_format(this.now_num);
        window.setTimeout(this.ck_time_ani.bind(this), 100);  
      }
      else
      {
        document.getElementById(this.num_id).innerHTML = this.n_format(this.max_value);
      }  
    }  
    else
    {
      this.now_num = Math.floor(this.gap_time*this_time);
      if(this.now_num > this.max_value)
      {
        document.getElementById(this.num_id).innerHTML = this.n_format(this.now_num);
        window.setTimeout(this.ck_time_ani.bind(this), 100);  
      }
      else
      {
        document.getElementById(this.num_id).innerHTML = this.n_format(this.max_value);
      }  
      
    }  
  };    

  //숫자에 ,추가
  this.n_format = function (input_number)
  {
     m_ck = false;
   //음수처리
    abs_input_number = Math.abs(input_number);
  
    if(abs_input_number != input_number)
    {
      input_number = abs_input_number;
      m_ck = true;
    } 
   
  //,없앤 숫자
    input_number = new String(input_number)
    input_number_1 = new String();
    input_number_2 = new String();



  //소수점처리
    c_pos = input_number.indexOf(".");
    if(c_pos > 0)
    {
     input_number_1 = input_number.substring(0, c_pos);
     input_number_2 = input_number.substring(c_pos + 1, input_number.length);   
     input_number = input_number_1;
    }

    input_number = c_format(input_number);
    number = input_number;
    number_str = "";
    for(i_01 = 0 ; i_01 < number.length ; i_01++)
    {
      cpoint = i_01;
      this_number = number.substring(cpoint,cpoint+1);
      if((number.length - i_01) % 3 == 1 && i_01 != number.length -1)
      {
       this_number = this_number + ',';
      }
      number_str = number_str + this_number;
    }
    if(number_str == '') number_str = 0;
    if(input_number_2 != '')
    {
      number_str = number_str + "." + input_number_2;
    } 
    if(m_ck == true)  
    {
      number_str = "-" + number_str;
    }
    return number_str;

  };

  //숫자에, 빼기
  this.c_format = function(input_number)
  {
    var number = "";
    number = input_number + "";
    number_str = "";
    zero_ck = true;
    for(i_02 = 0 ; i_02 < number.length ; i_02++)
    {
      cpoint = i_02;
      this_number = number.substring(cpoint,cpoint+1);
      if(this_number != 0) 
      {
        zero_ck = false;
      }  
    
      if(this_number == '-' || this_number == '0'  || this_number == '1' || this_number == '2'   || this_number == '3'   || this_number == '4'   || this_number == '5'   || this_number == '6'   || this_number == '7'   || this_number == '8'   || this_number == '9')
      {
         if(zero_ck == true)
         {
           number_str = number_str + '';
         }
         else
         {
          number_str = number_str + this_number;
         } 
      }
    }
    return number_str;

  };

  this.ini();
  
}  



//숫자인지 아닌지 비교
function isNumber(value)
{ 
    return typeof value === 'number' && isFinite(value);
}


//숫자를 한글로 읽기
Number.prototype.hangul_num = function() {
   if(isNaN(this)) return "<span style='color:red;'>숫자만입력</span>";
   if (this == 0) return '영';
   var phonemic = ['','일','이','삼','사','오','육','칠','팔','구'];
   var unit = ['','','십','백','천','만','십만','백만','천만','억','십억','백억','천억','조','십조','백조'];

   var ret = '';
   var part = new Array();
   for (var x=0; x<String(this).length; x++) part[x] = String(this).substring(x,x+1);
   for (var i=0, cnt = String(this).length; cnt > 0; --cnt,++i) {
    p = phonemic[part[i]];
    p+= (p) ? (cnt>4 && phonemic[part[i+1]]) ? unit[cnt].substring(0,1) : unit[cnt] : '';
    ret+= p;
   }
   return ret;
}

//숫자를 한글로 읽어서 span이나 div쪽에 출력
function num2hangul(input_num, ret_id)
{
  document.getElementById(ret_id).innerHTML = Number(input_num).hangul_num();
}  


function search_zip(zip_id, add_id)
{
  open_url = SiteUrl + '/forms/zipcode.html?ret_zipcode=' + zip_id + '&ret_address=' + add_id;
  window.open(open_url, 'zipcode', 'width=440, height=220, scrollbars=yes');
}


function mail_send(U_email)
{
  open_url = SiteUrl + '/wowinfo/mail_send.html?U_email=' + U_email;
  window.open(open_url, 'email', 'width=600, height=500, scrollbars=no');  
}

function quick_sms(phonenum)
{
  open_url = SiteUrl + "/forms/quick_sms.html?phonenum=" + phonenum;
  window.open(open_url, 'sms1', 'width=100, height=260');
}


function next_field(this_id, next_id, this_max)
{
  
 if($(this_id).value.length >= this_max)
 {
   $(next_id).focus();
   $(next_id).select();
 }
}




//쿠키 생성 함수
function setCookie(name, value, expire_day)
{
   	var expireDate = new Date;
   	domain_name = location.hostname;
  	expireDate.setTime(expireDate.getTime() + 60*60*24*1000 * eval(expire_day));
  	var option1 = "expires="+expireDate.toGMTString() ;
    var option2 = "path=/;domain=" + domain_name;
    document.cookie = name + "=" + escape(value)  + "; " + option1 + "; " + option2 ;
}


//쿠키값을 가져오는 함수
function getCookie(name) {
	var Found=false
	var start,end
	var i=0
	//cookie 문자열 전체를 검색
	while(i<=document.cookie.length) {
		start=i
		end=start+name.length
		//name과 동일한 문자가 있다면
		if(document.cookie.substring(start,end)==name){
			Found=true
			break
		}
		i++
	}
	//name문자열을 cookie에서 찾았다면
	if(Found==true) {
		start=end+1
		end=document.cookie.indexOf(';',start)
		//마지막부분이라는 것을 의미(마지막에는 ';'가 없다)
		if(end<start)
			end=document.cookie.length
		//name에 해당하는 value값을 추출하여 리턴한다.
		return document.cookie.substring(start,end)
	}
	//찾지 못했다면
	return ''
}



// 스크롤 퀵메뉴
// new Floating($('obj_id'),0,0,0,0);

function Floating(FloatingObj,MarginX,MarginY,Percentage,setTime) { 
this.FloatingObj = FloatingObj; 
this.MarginX = (MarginX) ? MarginX : 0; 
this.MarginY = (MarginY) ? MarginY : 0; 
this.Percentage = (Percentage) ? Percentage : 20; 
this.setTime = (setTime) ? setTime : 10; 
this.FloatingObj.style.position = "absolute"; 
this.Body = null; 
this.setTimeOut = null; 
this.Run(); 
} 

Floating.prototype.Run = function () { 
if ((document.documentElement.scrollLeft + document.documentElement.scrollTop) > (document.body.scrollLeft + document.body.scrollTop)) { 
this.Body = document.documentElement; 
} else { 
this.Body = document.body; 
} 

var This = this; 
var FloatingObjLeft = (this.FloatingObj.style.left) ? parseInt(this.FloatingObj.style.left,10) : this.FloatingObj.offsetLeft; 
var FloatingObjTop = (this.FloatingObj.style.top) ? parseInt(this.FloatingObj.style.top,10) : this.FloatingObj.offsetTop; 
//var DocLeft = this.Body.scrollLeft + this.MarginX; 
var DocLeft = this.MarginX; 
var DocTop = this.Body.scrollTop + this.MarginY; 

var MoveX = Math.abs(FloatingObjLeft - DocLeft); 
MoveX = Math.ceil(MoveX / this.Percentage); 
var MoveY = Math.abs(FloatingObjTop - DocTop); 
MoveY = Math.ceil(MoveY / this.Percentage); 

if (FloatingObjLeft < DocLeft) { 
this.FloatingObj.style.left = FloatingObjLeft + MoveX + "px"; 
} else { 
this.FloatingObj.style.left = FloatingObjLeft - MoveX + "px"; 
} 

if (FloatingObjTop < DocTop) { 
this.FloatingObj.style.top = FloatingObjTop + MoveY + "px"; 
} else { 
this.FloatingObj.style.top = FloatingObjTop - MoveY + "px"; 
} 

window.clearTimeout(this.setTimeOut); 
this.setTimeOut = window.setTimeout(function () { This.Run(); },this.setTime); 
} 




//마우스 드래그로 레이어 이동
//new set_drag_layer("움직일레이어", "감춰질레이어")
//아이프레임은 움질일때 문제가 발생하므로 레이어를 감춤


layer_zindex = 1000;
function set_drag_layer(obj_name, disable_name)
{
  this_obj = document.getElementById(obj_name);
  if(!disable_name) 
  {
    this.disable_name = '';       

  }  
  else
  {
    this.disable_name = disable_name;       
    disable_obj = document.getElementById(disable_name);    
    this.disable_obj = disable_obj;
  } 

  if(!this_obj.style.left) this_obj.style.left = 0;
  if(!this_obj.style.top) this_obj.style.top = 0;  
  this.layer_obj = this_obj; 

  this.layer_drag_start = false;   
  this.Run();
}  

set_drag_layer.prototype.Run = function () 
{ 
  this_obj = this.layer_obj;

  this.layer_obj.onmousedown= drag_layer_ini;
//  this.layer_obj.onmouseup = Function("  layer_drag_start=false;   this_obj.style.zIndex=layer_zindex;  enable_layer;      ");  
//  this.layer_obj.onmouseup = mouseup_layer;

  
  if(!document.onmouseup)
  {
    m_up = '';
  }
  else
  {
    m_up = document.onmouseup;
  }  
  
  document.onmouseup = mouseup_layer;
    
  layer_drag_start = this.layer_drag_start;



  if(!document.onmousedown)
  {
    m_dn = '';
  }
  else
  {
    m_dn = document.onmousedown;
  }
 
  function drag_layer_ini(e)
  {
    document.onmouseup = mouseup_layer;
    this_obj = document.getElementById(this.id);
    this_obj.style.filter = 'alpha(opacity=50, style=0)';    
    this_obj.style.opacity = '0.5';
    //드래그 시작시 배경글자 드래그막음
    disable_mm();
    if(typeof(disable_obj) != 'undefined')    
    {
        disable_obj.style.display  = 'none';
    } 
    layer_zindex = layer_zindex + 1;    
    this_obj.style.zIndex=layer_zindex;

     if(!e) e = window.event;    

    offsetx = e.clientX;
    offsety = e.clientY;    
    nowX=parseInt(this_obj.style.left);
    nowY=parseInt(this_obj.style.top);
    
    oldx = e.clientX - nowX
    oldy = e.clientY - nowY  
    
    layer_drag_start=true;
    document.onmousemove=drag_layer;


  }

  function disable_mm()
  {
     document.onmousedown = function(){return false}; 
  }  

  function enable_mm()
  {
    document.onmousedown = m_dn; 
  }


  
  function mouseup_layer()
  {
     layer_drag_start=false;   
     this_obj.style.zIndex=layer_zindex;
     this_obj.style.filter = '';    
     this_obj.style.opacity = '';    
      if(typeof(disable_obj) != 'undefined')    
     {                
        disable_obj.style.display  = 'block'; 
        enable_mm();
     }
     document.onmouseup  = m_up;     
   }

  function drag_layer(e)
  {
    if (!layer_drag_start) 
    {
      this_obj.style.filter = '';    
      this_obj.style.opacity = ''; 
      if(typeof(disable_obj) != 'undefined')    
      {                
        disable_obj.style.display  = 'block'; 
        enable_mm();
      }
      return; 
     }

     if(!e) e = window.event;    
     this_obj.style.left =  nowX + e.clientX - offsetx + 'px';     
     this_obj.style.top = nowY + e.clientY - offsety +  'px';     
    return false;
  }  
  
  
} 


function get_keycode(event) 
{
  var keycode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
  return keycode;
}


//-->


