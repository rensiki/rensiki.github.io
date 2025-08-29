---
layout: single
title:  "수직벡터와 AddTorque"
---




## Prefab과 Override


게임개발 팀원들과 만나서 회의를 진행하며 오브젝트들의 크기를 조절하는 시간을 가진 적이 있었다.
<br>
<br>

그 당시에 나는 prefab에 대한 개념이 잘 잡혀있지 않아서, 게임 오브젝트를 저장하고, 어렴풋이 공유도 하는 기능 정도로만 알고 있었다.

그래서 프리팹을 게임 씬에 불러와서 크기를 조정하고는, 그 수치를 일일이 저장된 프리팹에 들어가서 수정하는 방식으로 수정 사항을 저장했다. 

근데 작업 하면서, 뭔가 이상하다는 느낌을 많이 받아서 내가 prefab을 제대로 사용하고 있지 못하고 있었다는 것을 깨닫게 되었다.

그래서  회의가 끝난 이후에 이렇게 추가 공부를 하게 되었고, 애매모호하던 지식이 명확히 정리되었던 것 같다.
<br>
<br>
<br>

[인스턴스를 통한 프리팹 편집 - Unity 매뉴얼](https://docs.unity3d.com/kr/2021.3/Manual/EditingPrefabViaInstance.html)
<br>
<br>
<br>

Prefab의 instance들은 기본적으로 프로퍼티의 값을 공유한다.
<br>
<br>

![alt text](<../images/2025-08-29/image 1.png>)

prefab이 확실하게 학습해두지 않으면 헷갈리는 이유가 바로 이 부분인 것 같다. prefab의 instance라고 해서 모든 값이 공유되는 것이 아니라는 점이다.
<br>
<br>

![alt text](<../images/2025-08-29/image 2.png>)


오버라이드된 값들에는 파란색으로 표시를 해준다.
<br>
<br>


![alt text](<../images/2025-08-29/image 3.png>)

또한 alignment로 설정된 값도 prefab과 값을 공유하지 않는다.
<br>
<br>

그리고 이렇게 override된 프로퍼티 값들을 기존 prefab에 반영해서 나머지 인스턴스에도 모두 적용시키고 싶을 수 있다.

이때 여러가지 방법을 사용할 수 있다.
<br>
<br>

1: 모두 적용

![alt text](<../images/2025-08-29/image 4.png>)
<br>
<br>
<br>

2: 변경 사항을 클릭해가며 비교해가며 변경

![alt text](<../images/2025-08-29/image 5.png>)
<br>
<br>
<br>

3: 컴포넌트 개별 접근

![alt text](<../images/2025-08-29/image 6.png>)
<br>
<br>

여기서 보면 Table에 오버라이드 하는 것과 Vase에 직접 적용하는 것 2가지로 나뉘는 모습을 볼 수 있다. (revert를 누르면 변경사항을 되돌릴 수 있다)

![alt text](<../images/2025-08-29/image 7.png>)

이 기능은 네스티드 프리팹 구조일 때 사용된다. 즉, 위의 경우 Table에 Vase 프리팹이 들어있는 구조인 것이다.
<br>
<br>

Table에 오버라이드 하는 선택지를 고르면 Table 프리팹의 인스턴스들이 모두 영향을 받게 된다(오버라이드 되지 않았다면). 하지만 Vase 프리팹에는 영향을 주지 않아 Table 안에 있지 않은 Vase 인스턴스들은 영향을 받지 않는다. 

Vase에 적용하는 것을 선택하면 모든 Vase 인스턴스에 영향을 주기 때문에 Table 안에 있는 Vase도 변경되어 Table에도 영향을 주게 된다.

<br>
<br>
<br>
<br>

### 마치며

생각보다 프리팹의 기능이 다양해서 놀랐고, 게임을 구성하는 기초적인 프리팹을 제대로 이해하게된 것 같아서 뿌듯했던 것 같다.