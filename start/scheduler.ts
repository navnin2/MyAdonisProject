import scheduler from 'adonisjs-scheduler/services/main'
import RefreshToken from '#models/refresh_token'
import { DateTime } from 'luxon'

scheduler
  .call(async () => {
    const deleted = await RefreshToken.query()
      .where('expires_at', '<=', DateTime.now().toSQL())
      .delete()

    console.log(`Deleted ${deleted} expired refresh token(s)`)
  })
  .dailyAt('00:00')
