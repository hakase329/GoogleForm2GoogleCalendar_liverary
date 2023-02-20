/** 
 * フォームに入力された情報をライヴラリ配信カレンダーに登録するためのスクリプト
 * 2023/02/16 新規作成
 * 
 * パクリ元：https://myfunc.jp/items/00100/index.html
 * 登録先カレンダーID： xxxxxx@group.calendar.google.com
 */
function myFunction() {
  
}

function onSubmit(e) {

  // 予定を反映させるカレンダーのID（通常はメールアドレス）をセット
  const calendar_id = 'xxxxxx@group.calendar.google.com';

  // 「FormApp.getActiveForm を呼び出す権限がありません」というエラーが出たので明示的にFormAppを呼び出す
  FormApp.getActiveForm();

  // フォームの項目や回答を取得する
  const form_responses = e.response.getItemResponses();

  // 回答を格納する変数を宣言
  let event_date, event_start, event_end, event_title, event_ch, event_location;

  // フォームの項目数だけループする
  for (var i = 0; i < form_responses.length; i++) {

    // フォームの質問を取得
    let question = form_responses[i].getItem().getTitle();

    // 質問に対する回答を取得する
    let answer = form_responses[i].getResponse();

    // 項目名から、それぞれの値を該当の変数に格納していく
    if (question == '日付') {
      event_date = answer;
    } else if (question == '開始時間') {
      event_start = answer;
    } else if (question == '終了時間') {
      event_end = answer;
    } else if (question == '配信名') {
      event_title = answer;
    } else if (question == 'チャンネル') {
      event_ch = answer;
    } else if (question == '配信URL') {
      event_location = answer;
    }

  }

  // 日付と日時を連結して、Dateオブジェクトを作成する
  // endは未入力が許可されているので空の場合はstartから計算する
  event_start = new Date(event_date + ' ' + event_start);
  if (event_end != "") {
    event_end = new Date(event_date + ' ' + event_end);
  }else{
    // 未入力の場合はstartの1時間後をendにする
    event_end = new Date(event_start);
    event_end.setHours(event_start.getHours() + 1);
  }

  // endがstartより前の場合は日付を超えた配信とみなして+1日する
  if (event_end < event_start) {
    event_end.setDate(event_end.getDate() + 1);
  }

  // カレンダーのタイトルは”${配信チャンネル}：${配信名}”とする
  let cal_title = event_ch + "：" + event_title;

  // 説明と場所はoptionでセットする
  // ※場所(location: xx)は使わないので記載しない　event_locationは配信URLを入れる想定
  let options = {
    description: event_location
  }

  // 予定を追加するカレンダーを取得
  const calendar = CalendarApp.getCalendarById(calendar_id);

  // 予定を追加する
  const newEvent = calendar.createEvent(cal_title, event_start, event_end, options);

  // 予定を追加したついでに配信者によって予定の色を変更
  // カレンダーと色の名前が違うのでリファレンス参照
  // https://developers.google.com/apps-script/reference/calendar/event-color?hl=ja
  // ※CalendarApp.EventColorが予定用のEnumで、CalendarApp.Colorはカレンダー用Enumっぽいので指定間違いに注意！
  if (event_ch == "餅月ひまり") {
    newEvent.setColor(CalendarApp.EventColor.CYAN);
  } else if (event_ch == "図月つくる") {
    newEvent.setColor(CalendarApp.EventColor.ORANGE);
  } else if (event_ch == "赤月ゆに") {
    newEvent.setColor(CalendarApp.EventColor.RED);
  } else if (event_ch == "無月めもり") {
    newEvent.setColor(CalendarApp.EventColor.GRAY);
  }

// クローズ処理とかはないみたい
}