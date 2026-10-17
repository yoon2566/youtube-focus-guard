package kr.yoon.focusguard;

import android.app.Activity;
import android.app.AlertDialog;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.view.accessibility.AccessibilityManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import java.text.DateFormat;
import java.util.Date;

public final class MainActivity extends Activity {
    private TextView status;
    private TextView history;
    private Button toggle;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        ScrollView scroll = new ScrollView(this);
        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(24), dp(24), dp(24), dp(24));
        scroll.addView(content);
        scroll.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        setContentView(scroll);
        scroll.requestApplyInsets();
        TextView title = label("유튜브 집중 가드", 27);
        content.addView(title);
        content.addView(label("유튜브를 열면 홈 화면으로 돌아갑니다.", 16));
        status = label("", 18);
        content.addView(status);
        toggle = button("", v -> {
            boolean next = !GuardState.enabled(this);
            GuardState.setEnabled(this, next);
            refresh();
            if (next && !accessibilityEnabled()) showPermissionExplanation();
        });
        content.addView(toggle);
        content.addView(button("접근성 권한 설정", v -> showPermissionExplanation()));
        content.addView(button("유튜브 열어 테스트", v -> {
            Intent launch = getPackageManager().getLaunchIntentForPackage(BlockPolicy.YOUTUBE);
            if (launch == null) {
                Toast.makeText(this, "유튜브 앱 설치 여부를 확인해 주세요.", Toast.LENGTH_LONG).show();
            } else {
                try { startActivity(launch); }
                catch (RuntimeException e) { Toast.makeText(this, "유튜브를 직접 실행해 주세요.", Toast.LENGTH_LONG).show(); }
            }
        }));
        history = label("", 15);
        content.addView(history);
        content.addView(button("상태 새로고침", v -> refresh()));
        content.addView(label("사용 순서\n1. 접근성 설정에서 ‘유튜브 집중 가드’를 허용하세요.\n2. 차단 ON을 누르세요.\n3. 유튜브를 열어 홈으로 돌아오는지 확인하세요.\n4. 차단 OFF 후에는 유튜브를 정상 사용합니다.", 16));
        content.addView(label("설치 후 접근성이 막혀 있다면\n휴대폰 설정 → 앱 → 유튜브 집중 가드 → 메뉴에서 ‘제한된 설정 허용’을 확인하세요. 메뉴 위치는 기기마다 다릅니다.", 14));
        content.addView(label("범위와 개인정보\n유튜브 Android 앱만 대상입니다. 브라우저·YouTube Music·백그라운드 재생은 제한 대상이 아닙니다. 권한을 끄거나 앱을 삭제하면 제한이 해제됩니다.\n화면 내용과 입력 내용을 읽지 않으며 인터넷 권한도 없습니다. ON/OFF와 홈 이동 요청 기록만 기기에 저장합니다.", 14));
        content.addView(label("해커톤 MVP · v0.1.0 · Android 8.0 이상", 12));
    }

    @Override protected void onResume() { super.onResume(); refresh(); }

    private boolean accessibilityEnabled() {
        AccessibilityManager manager = (AccessibilityManager) getSystemService(ACCESSIBILITY_SERVICE);
        for (AccessibilityServiceInfo info : manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)) {
            if (info.getResolveInfo() != null && info.getResolveInfo().serviceInfo != null
                    && getPackageName().equals(info.getResolveInfo().serviceInfo.packageName)
                    && YouTubeBlockService.class.getName().equals(info.getResolveInfo().serviceInfo.name)) return true;
        }
        return false;
    }

    private void refresh() {
        if (status == null) return;
        boolean enabled = GuardState.enabled(this);
        boolean permission = accessibilityEnabled();
        status.setText("차단 설정: " + (enabled ? "ON" : "OFF") + "\n접근성 권한: "
                + (permission ? "허용됨" : "필요함") + "\n"
                + (enabled && permission ? "유튜브 실행 감지 대기 중" : enabled ? "권한을 허용해야 차단이 작동합니다." : "유튜브 사용을 제한하지 않습니다."));
        status.setTextColor(enabled && permission ? Color.rgb(20, 100, 60) : Color.DKGRAY);
        toggle.setText(enabled ? "차단 OFF로 전환" : "차단 ON으로 전환");
        SharedPreferences prefs = GuardState.prefs(this);
        long timestamp = prefs.getLong("lastAttemptAt", 0);
        history.setText("홈 이동 요청 수락: " + prefs.getInt("homeRequests", 0) + "회\n최근 감지: "
                + (timestamp == 0 ? "없음" : DateFormat.getDateTimeInstance().format(new Date(timestamp)))
                + (timestamp == 0 ? "" : "\n최근 홈 이동 요청: " + (prefs.getBoolean("lastAccepted", false) ? "수락됨" : "실패 — 다시 테스트해 주세요")));
    }

    private void showPermissionExplanation() {
        new AlertDialog.Builder(this).setTitle("접근성 사용 안내")
                .setMessage("유튜브의 화면 전환 이벤트를 감지하고 홈 화면으로 이동하기 위해 접근성 권한이 필요합니다. 화면 내용·입력 내용은 읽거나 전송하지 않습니다. 언제든 차단 OFF 또는 접근성 설정에서 해제할 수 있습니다.\n\n설정에서 ‘유튜브 집중 가드’를 찾아 사용을 허용해 주세요.")
                .setNegativeButton("취소", null)
                .setPositiveButton("동의하고 설정 열기", (dialog, which) -> startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)))
                .show();
    }

    private TextView label(String text, int size) {
        TextView v = new TextView(this);
        v.setText(text); v.setTextSize(size); v.setTextColor(Color.DKGRAY);
        v.setPadding(0, dp(10), 0, dp(10));
        return v;
    }
    private Button button(String text, View.OnClickListener listener) {
        Button b = new Button(this); b.setText(text); b.setAllCaps(false);
        b.setMinHeight(dp(56)); b.setOnClickListener(listener); return b;
    }
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
}
