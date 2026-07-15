<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'decoupledwpdb' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

define('JWT_AUTH_SECRET_KEY', '246810');
define('JWT_AUTH_CORS_ENABLE', true);

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'nNWU_7L/Fp%%WB3j;kI>d(!$C])ksCyyl<[uhrbaet<{8 A7%U<wSgs1_DMPgRn ' );
define( 'SECURE_AUTH_KEY',  'L;k5!F8!2(5~ImVK`AR1GSjL<#xvk:FP+x*D2M5#=x F%)Mu$]?N?btD#]+G5sv:' );
define( 'LOGGED_IN_KEY',    '6B}jB3rN%BxA<7vUqpcmkpF>*Fq]Fm=|K~i8?:p#zMGB%.@t2SqC51$:ck_]ge5G' );
define( 'NONCE_KEY',        'DV~C~a]8d^)Gj*KoeA;~l?j*F_DD0Qmf.k1.s}&lU~vKx)UYf7h}}}X39/:Kb%s+' );
define( 'AUTH_SALT',        'QCsIv8=TnL&>bQ-P4aWPQJg:U%iAs/)IUXB@S@]4u(2yjao~M/by.J-_3gCR1TyI' );
define( 'SECURE_AUTH_SALT', 'RS2LWX,OtQ9I:BztQvNQ~+ M#Fa:8`;Q/cv*)``K;h^U.Ro^(>J?7q7X_q{2fsb<' );
define( 'LOGGED_IN_SALT',   '1 9{ItLiRB<,;wkU5v%=xHYYsqrUckD2>}*gX3lhr-@]w AtWDo!TSwk1)LdGK{?' );
define( 'NONCE_SALT',       'H*b#$cfBF_K*%56j#NwrWnRi,tcAJO6lr|?uhZ?59-s4PZp,s^eh?>i0kEZ<Yov4' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
