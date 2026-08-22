const { withPodfile } = require('expo/config-plugins');

// Fix: AppCheckCore (Firebase) is a Swift pod that requires GoogleUtilities and
// RecaptchaInterop to define modules. Add :modular_headers => true for both.
module.exports = function withPodfileModularHeaders(config) {
  return withPodfile(config, (config) => {
    const modularHeaders = [
      "  pod 'GoogleUtilities', :modular_headers => true",
      "  pod 'RecaptchaInterop', :modular_headers => true",
    ].join('\n');

    config.modResults.contents = config.modResults.contents.replace(
      /( +use_react_native!)/,
      `${modularHeaders}\n$1`,
    );

    return config;
  });
};
