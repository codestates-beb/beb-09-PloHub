package configs

import "github.com/spf13/viper"

type Config struct {
	Postgres struct {
		Host     string `mapstructure:"host"`
		Port     string `mapstructure:"port"`
		User     string `mapstructure:"user"`
		Password string `mapstructure:"password"`
		Database string `mapstructure:"database"`
		SSLMode  string `mapstructure:"ssl_mode"`
		TimeZone string `mapstructure:"timezone"`
		Timeout  string `mapstructure:"timeout"`
	} `mapstructure:"postgres"`
	JWT struct {
		Issuer             string `mapstructure:"issuer"`
		Audience           string `mapstructure:"audience"`
		AccessTokenSecret  string `mapstructure:"access_token_secret"`
		RefreshTokenSecret string `mapstructure:"refresh_token_secret"`
	} `mapstructure:"jwt"`
	Server struct {
		Port   string `mapstructure:"port"`
		Domain string `mapstructure:"domain"`
	} `mapstructure:"server"`
}

func NewConfig(filename string) (*Config, error) {
	viper.SetConfigFile(filename)

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var config Config

	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
