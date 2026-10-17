package kr.yoon.focusguard;

import android.content.Context;
import android.content.SharedPreferences;

final class GuardState {
    private GuardState() {}
    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("guard", Context.MODE_PRIVATE);
    }
    static boolean enabled(Context c) { return prefs(c).getBoolean("enabled", false); }
    static void setEnabled(Context c, boolean enabled) {
        prefs(c).edit().putBoolean("enabled", enabled).apply();
    }
}
