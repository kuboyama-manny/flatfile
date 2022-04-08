<?php
if (!function_exists('rollout')) {
    /**
     * Return the rollout instance
     * @return \Opensoft\Rollout\Rollout
     */
    function rollout()
    {
        return app(\Opensoft\Rollout\Rollout::class);
    }
}
if (!function_exists('feature_active')) {
    /**
     * Check if a feature is active (for the current user)
     * @param $feature
     * @param null $user
     * @return boolean
     */
    function feature_active($feature, $user = null)
    {
        return rollout()->isActive($feature, $user);
    }
}
if (!function_exists('features_list')) {
    /**
     * Return list of all features
     * @return array
     */
    function features_list()
    {
        return collect(rollout()->features());
    }
}
