-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 15, 2012 at 10:37 PM
-- Server version: 5.0.77
-- PHP Version: 5.1.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `2012Winter361bwong117`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_objects`
--

CREATE TABLE IF NOT EXISTS `active_objects` (
  `gid` int(11) NOT NULL,
  `ssid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `oid` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  PRIMARY KEY  (`gid`,`ssid`,`pid`,`oid`),
  KEY `ssid` (`ssid`),
  KEY `pid` (`pid`),
  KEY `oid` (`oid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `active_objects`
--


-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE IF NOT EXISTS `games` (
  `gid` int(11) NOT NULL auto_increment,
  `status` int(11) NOT NULL default '0',
  `owner` int(11) NOT NULL,
  PRIMARY KEY  (`gid`),
  KEY `owner` (`owner`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `games`
--


-- --------------------------------------------------------

--
-- Table structure for table `multi_games`
--

CREATE TABLE IF NOT EXISTS `multi_games` (
  `gid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `ssid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY  (`gid`,`uid`),
  KEY `uid` (`uid`),
  KEY `ssid` (`ssid`),
  KEY `pid` (`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `multi_games`
--


-- --------------------------------------------------------

--
-- Table structure for table `objects`
--

CREATE TABLE IF NOT EXISTS `objects` (
  `oid` int(11) NOT NULL auto_increment,
  `type` int(11) NOT NULL,
  `current_stats` text,
  PRIMARY KEY  (`oid`),
  KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `objects`
--


-- --------------------------------------------------------

--
-- Table structure for table `planetary_systems`
--

CREATE TABLE IF NOT EXISTS `planetary_systems` (
  `gid` int(11) NOT NULL,
  `ssid` int(11) NOT NULL,
  `pid` int(11) NOT NULL auto_increment,
  `type` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY  (`gid`,`ssid`,`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `planetary_systems`
--


-- --------------------------------------------------------

--
-- Table structure for table `preset_objects`
--

CREATE TABLE IF NOT EXISTS `preset_objects` (
  `type` int(11) NOT NULL auto_increment,
  `model` varchar(100) default NULL,
  `texture` varchar(100) default NULL,
  `initial_stats` text,
  PRIMARY KEY  (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `preset_objects`
--


-- --------------------------------------------------------

--
-- Table structure for table `preset_planetary_systems`
--

CREATE TABLE IF NOT EXISTS `preset_planetary_systems` (
  `type` int(11) NOT NULL auto_increment,
  `top` varchar(100) default NULL,
  `bottom` varchar(100) default NULL,
  `front` varchar(100) default NULL,
  `back` varchar(100) default NULL,
  `leftside` varchar(100) default NULL,
  `rightside` varchar(100) default NULL,
  PRIMARY KEY  (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `preset_planetary_systems`
--


-- --------------------------------------------------------

--
-- Table structure for table `single_games`
--

CREATE TABLE IF NOT EXISTS `single_games` (
  `gid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `ssid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY  (`gid`),
  KEY `uid` (`uid`),
  KEY `ssid` (`ssid`),
  KEY `pid` (`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `single_games`
--


-- --------------------------------------------------------

--
-- Table structure for table `solar_systems`
--

CREATE TABLE IF NOT EXISTS `solar_systems` (
  `gid` int(11) NOT NULL default '0',
  `ssid` int(11) NOT NULL auto_increment,
  `x` int(11) default NULL,
  `y` int(11) default NULL,
  `name` varchar(50) default NULL,
  PRIMARY KEY  (`gid`,`ssid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `solar_systems`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL auto_increment,
  `type` int(11) NOT NULL default '1',
  `uname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `status` int(11) NOT NULL default '1',
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `type`, `uname`, `email`, `password`, `status`) VALUES
(1, 1, 'bw', 'bw@cool.com', 'iamcool', 1),
(2, 1, 'cw', 'cw@success.com', 'iamawesome', 1),
(3, 1, 'sl', 'sl@music.com', 'iamcool', 1),
(4, 1, 'qht', 'qht@hockeylove.com', 'iamawesome', 1);
