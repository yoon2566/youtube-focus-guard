package kr.yoon.focusguard;

/** Pure decision rule, shared by the service and host-side tests. */
public final class BlockPolicy {
    public static final String YOUTUBE = "com.google.android.youtube";
    private BlockPolicy() {}
    public static boolean shouldBlock(boolean enabled, CharSequence packageName) {
        return enabled && packageName != null && YOUTUBE.contentEquals(packageName);
    }
}
