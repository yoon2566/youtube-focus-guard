package kr.yoon.focusguard;

public final class BlockPolicyTest {
    public static void main(String[] args) {
        check(BlockPolicy.shouldBlock(true, "com.google.android.youtube"), "YouTube ON");
        check(!BlockPolicy.shouldBlock(false, "com.google.android.youtube"), "YouTube OFF");
        check(!BlockPolicy.shouldBlock(true, "com.android.settings"), "Settings always available");
        check(!BlockPolicy.shouldBlock(true, "kr.yoon.focusguard"), "Guard always available");
        check(!BlockPolicy.shouldBlock(true, "com.google.android.youtube.music"), "Exact package match");
        check(!BlockPolicy.shouldBlock(true, null), "Null event package");
        check(!BlockPolicy.shouldBlock(true, "com.android.chrome"), "Browser out of scope");
        System.out.println("PASS: 7 block-policy checks");
    }
    private static void check(boolean value, String label) {
        if (!value) throw new AssertionError(label);
    }
}
