package kr.yoon.focusguard;

import android.accessibilityservice.AccessibilityService;
import android.os.SystemClock;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Toast;

public final class YouTubeBlockService extends AccessibilityService {
    private long lastAttempt = -1000;

    @Override public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getEventType() != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
                || !BlockPolicy.shouldBlock(GuardState.enabled(this), event.getPackageName())) return;
        long now = SystemClock.elapsedRealtime();
        if (now - lastAttempt < 500) return;
        lastAttempt = now;
        boolean accepted = performGlobalAction(GLOBAL_ACTION_HOME);
        GuardState.prefs(this).edit()
                .putLong("lastAttemptAt", System.currentTimeMillis())
                .putBoolean("lastAccepted", accepted)
                .putInt("homeRequests", GuardState.prefs(this).getInt("homeRequests", 0) + (accepted ? 1 : 0))
                .apply();
        Log.i("FocusGuard", "YouTube detected; HOME accepted=" + accepted);
        if (accepted) Toast.makeText(this, "집중 모드: 유튜브 사용을 제한했어요", Toast.LENGTH_SHORT).show();
    }

    @Override public void onInterrupt() { }
}
