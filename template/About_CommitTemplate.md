# Commit Message Template
- 기본적으로 사용되는 커밋 메시지를 명시적으로 커밋 내역을 확인하기 위하여 템플릿을 제공하여 사용하기위해 사용된다. 

![image](https://user-images.githubusercontent.com/31919227/148339065-1100c227-1466-410c-864f-5e5783350a83.png)


### 커밋 메시지에는 의도를 전달하기 위해 다음과 같은 구조적 요소가 포함되어 있다.
```
# Feat	     새로운 기능을 추가할 경우
# Fix	       버그를 고친 경우
# Design	   CSS 등 사용자 UI 디자인 변경
# Style	     코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우
# Refactor	 프로덕션 코드 리팩토링
# Comment	   필요한 주석 추가 및 변경
# Docs	     문서를 수정한 경우
# Test	     테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)
# Chore 	   빌드 태스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)
# Rename	   파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
# Remove	   파일을 삭제하는 작업만 수행한 경우
```



## 루트 디렉토리하위에 커밋 메시지 템플릿 파일 생성 ( /.gitMessage.txt )
```
###############################################################
# Commit Message Template
###############################################################

# <type> : <subject>
# Subject 50 characters
 
# Body Message
# Body 72 characters(부연설명)

# footer (이슈를 추적하기 위한 이슈번호)
# Issue Tracker Number  ex) issue #1


###############################################################
# Rememver ME Commit Message 
###############################################################

#### type 에는 다음과 은 단어가 들어가도록한다. ####
# Feat	        새로운 기능을 추가할 경우
# Fix	        버그를 고친 경우
# Design	    CSS 등 사용자 UI 디자인 변경
# Style	        코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우
# Refactor	    프로덕션 코드 리팩토링
# Comment	    필요한 주석 추가 및 변경
# Docs	        문서를 수정한 경우
# Test	        테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)
# Chore 	    빌드 태스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)
# Rename	    파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
# Remove	    파일을 삭제하는 작업만 수행한 경우
```

## Github Action을 이용한 커밋 규격 체크


### .github/workflows/check_commit_message.yml 파일 생성
```
name: Check Commit Message

on: 
  pull_request:
    types:
      - opened
      - edited
      - reopened
      - synchronize
  pull_request_target:
    types:
      - opened
      - edited
      - reopened
      - synchronize
  # push:
  #   branches:
  #     - master

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Commit Type
        uses: gsactions/commit-message-checker@v1
        with:
          pattern: '(Feat|feat|Fix|fix|Design|design|Style|style|Refactor|refactor|Comment|comment|Docs|docs|Test|test|Chore|chore|Rename|rename|Remove|remove)'
          flags: 'gm'
          checkAllCommitMessages: 'true' # optional: this checks all commits associated with a pull request
          accessToken: ${{ secrets.GITHUB_TOKEN }} # github access token is only required if checkAllCommitMessages is true
          error: 'Your first line has to contain a commit type like "Fix".'
      # - name: Check for Issue number
      #   uses: gsactions/commit-message-checker@v1
      #   with:
      #     pattern: '(issue) \#([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])+$'
      #     checkAllCommitMessages: 'true' # optional: this checks all commits associated with a pull request
      #     accessToken: ${{ secrets.GITHUB_TOKEN }} # github access token is only required if checkAllCommitMessages is true
      #     error: 'You need at least one "issue #<issue number>" line.'
          
  run-if-fail:
    if: ${{ always() && (needs.check.result=='failure') }}
    needs: [check]
    runs-on: ubuntu-latest
    env: 
      PR_NUMBER: ${{ github.event.number }}
    steps:
      - uses: actions/github-script@v3
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          script: |
            github.issues.createComment({
              issue_number: ${{ env.PR_NUMBER }},
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '요청해 주신 PR이 [하모나이즈 프로젝트의 커밋 컨벤션](https://github.com/hamonikr/hamonize/blob/master/.gitmessage.txt)을 위반합니다. \n커밋 메시지와 PR title에 다음 Commit Type 중 하나를 포함해 주세요. \nFeat Fix Design Style Refactor Comment Docs Test Chore Rename Remove'
            })
 

```
