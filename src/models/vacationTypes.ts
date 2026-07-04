export interface Vacation {
  vacation_id: number;
  destination: string;
  description: string | null;
  start_date: string;
  end_date: string;
  price: string;
  image_filename: string | null;
  created_at?: string | undefined;
}

export interface VacationResponse extends Vacation {
  likesCount: number;
  isLiked: boolean;
}

export interface VacationUpsertBody {
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number | string;
  image_filename?: string | null;
}
