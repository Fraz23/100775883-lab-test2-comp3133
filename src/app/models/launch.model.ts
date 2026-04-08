export interface LaunchLinks {
  mission_patch_small: string | null;
  article_link: string | null;
  video_link: string | null;
  wikipedia: string | null;
}

export interface LaunchSite {
  site_name_long: string;
}

export interface Rocket {
  rocket_name: string;
  rocket_type: string;
}

export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_date_utc: string;
  launch_success: boolean | null;
  details: string | null;
  upcoming: boolean;
  rocket: Rocket;
  launch_site: LaunchSite;
  links: LaunchLinks;
}