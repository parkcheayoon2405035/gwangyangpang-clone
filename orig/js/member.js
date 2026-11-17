<!--
 function next_jumin()
{

 if(member.U_jumin1.value.length == 6)
 {
   member.U_jumin2.focus();
   member.U_jumin2.select();
 }
}

function jumin_birh(jumin1)
{
   date_y = jumin1.substring(0,2);
   date_m = jumin1.substring(2,4);
   date_d = jumin1.substring(4,6);
   if (date_y > 20) date_y = eval(date_y) + 1900;
   else date_y = eval(date_y) + 2000;
   member.U_birth_y.value = date_y
   member.U_birth_m.value = date_m
   member.U_birth_d.value = date_d

}


function check_id(id)
{
    $.ajax({
        type : 'GET',
        url : SiteUrl + "/member/ajax_check_id.php",
        data : {"id" : id},
        success : function (data) {print_id(data);},
        error : function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
               alert(thrownError);
        }

    });
}

function print_id(result)
{
    output_id = document.getElementById("id_result");
   	output_id.innerHTML = result;  
}


/* prototype 이용시
function check_id(id)
{


    var url = "ajax_check_id.php?id=" + id;
    new Ajax.Request
    ( 
      url, 
      { 
          method:    "get", 
          onComplete: print_id.bind(this)
      }
    );   



}

function print_id(result)
{
    output_id = document.getElementById("id_result");
   	output_id.innerHTML = result.responseText;
}
*/

    function openDaumPostcode() 
    {
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                document.getElementById('U_zipcode').value = data.zonecode;
                var fullAddr = ''; // 최종 주소 변수
                var extraAddr = ''; // 조합형 주소 변수

                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    fullAddr = data.roadAddress;

                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    fullAddr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
                if(data.userSelectedType === 'R'){
                    //법정동명이 있을 경우 추가한다.
                    if(data.bname !== ''){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있을 경우 추가한다.
                    if(data.buildingName !== ''){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                    fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
                }
                document.getElementById('U_address').value = fullAddr;

                //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                //document.getElementById('addr').value = addr;


            }
        }).open();
    }


//-->